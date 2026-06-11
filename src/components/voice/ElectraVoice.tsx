import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Modal, NativeModules, Alert,
} from 'react-native';
import { ANTHROPIC_KEY } from '../../config/keys';
import electraApi from '../../lib/api';

const { SpeechModule } = NativeModules;
const ANTHROPIC_API_KEY = ANTHROPIC_KEY;

type EstadoIA = 'idle' | 'aguardando' | 'escutando' | 'processando' | 'falando';

const buildPrompt = (estacoes: any[]) => {
  const listaEstacoes = estacoes.map(e =>
    `- ${e.nome}: ${e.tipo} ${e.potencia_kw}kW, R$${e.preco_kwh}/kWh, ${e.conectores_livres}/${e.conectores_total} livres, ${e.status}`
  ).join('\n');

  return `Você é ELECTRA, a assistente pessoal de bordo do proprietário de um veículo elétrico.

Fale como uma pessoa real — natural, direta, sem formalidades excessivas. Não use listas, não use bullet points, não fale como robô. Use linguagem coloquial brasileira.

DADOS DO VEÍCULO E USUÁRIO:
- Veículo: BYD Seal 03
- Bateria atual: 42%
- Autonomia estimada: 168 km
- Localização: São Paulo, SP

ESTAÇÕES PRÓXIMAS (dados em tempo real):
${listaEstacoes || '- Sem estações disponíveis no momento'}

SERVIÇOS:
- SOS Rescue disponível (~8 min)
- Marketplace nas estações
- Sistema de pontos e recompensas

REGRAS DE COMPORTAMENTO:
- Responda em português brasileiro natural — como um copiloto inteligente
- Máximo 2 frases curtas — será lido em voz alta
- Adapte ao contexto — se a bateria está baixa, seja proativa
- Aprenda o padrão do usuário com o tempo — se ele pergunta sempre sobre preço, priorize preço
- Nunca diga "Com base nas informações" ou "De acordo com" — fale naturalmente
- Se não souber algo, diga simplesmente que não tem essa informação agora
- Não repita o nome ELECTRA a cada resposta`;
};

export const ElectraVoice: React.FC = () => {
  const [estado, setEstado]             = useState<EstadoIA>('idle');
  const [transcricao, setTranscricao]   = useState('');
  const [resposta, setResposta]         = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [estacoes, setEstacoes]         = useState<any[]>([]);
  const [historico, setHistorico]       = useState<{role:string, content:string}[]>([]);
  const [escutandoWakeWord, setEscutandoWakeWord] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Carrega estações reais do Supabase
  useEffect(() => {
    const carregarEstacoes = async () => {
      const { stations: data } = await electraApi.getEstacoes();
      if (data) setEstacoes(data);
    };
    carregarEstacoes();
  }, []);

  // Escuta wake word "ELECTRA" em background
  useEffect(() => {
    let intervalo: any;
    if (escutandoWakeWord && SpeechModule) {
      intervalo = setInterval(async () => {
        try {
          const texto = await SpeechModule.startListeningShort?.();
          if (texto && texto.toLowerCase().includes('electra')) {
            setEscutandoWakeWord(false);
            iniciarEscuta();
          }
        } catch {}
      }, 3000);
    }
    return () => clearInterval(intervalo);
  }, [escutandoWakeWord]);

  useEffect(() => {
    return () => { SpeechModule?.stop(); };
  }, []);

  const iniciarPulso = () => {
    pulseLoop.current = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.25, duration:600, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,    duration:600, useNativeDriver:true }),
    ]));
    pulseLoop.current.start();
  };

  const pararPulso = () => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  };

  const chamarClaude = async (texto: string): Promise<string> => {
    try {
      const mensagens = [
        ...historico,
        { role:'user', content: texto },
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 120,
          system: buildPrompt(estacoes),
          messages: mensagens,
        }),
      });

      const data = await response.json();

      if (data.content?.[0]?.text) {
        const respostaIA = data.content[0].text;
        // Mantém histórico para contexto (máx 10 mensagens)
        setHistorico(prev => [
          ...prev.slice(-8),
          { role:'user', content: texto },
          { role:'assistant', content: respostaIA },
        ]);
        return respostaIA;
      }

      return 'Não consegui processar agora. Tenta de novo.';
    } catch {
      return 'Sem conexão no momento.';
    }
  };

  const iniciarEscuta = async () => {
    if (!SpeechModule) {
      Alert.alert('Erro', 'Módulo de voz não disponível');
      return;
    }

    setEstado('escutando');
    setTranscricao('');
    setResposta('');
    setModalVisivel(true);
    iniciarPulso();

    try {
      const texto = await SpeechModule.startListening();
      pararPulso();

      if (!texto || texto.trim() === '') {
        setEstado('idle');
        setTimeout(() => setModalVisivel(false), 800);
        return;
      }

      setTranscricao(texto);
      setEstado('processando');

      const respostaClaude = await chamarClaude(texto);
      setResposta(respostaClaude);
      setEstado('falando');

      try { await SpeechModule.speak(respostaClaude); } catch {}

      setTimeout(() => {
        setEstado('idle');
        setTimeout(() => setModalVisivel(false), 800);
      }, 2000);

    } catch {
      pararPulso();
      setEstado('idle');
      setModalVisivel(false);
    }
  };

  const fechar = () => {
    SpeechModule?.stop();
    pararPulso();
    setEstado('idle');
    setModalVisivel(false);
  };

  const COR: Record<EstadoIA, string> = {
    idle:'#00E5FF', aguardando:'#A78BFA', escutando:'#FF3B5C', processando:'#FFB800', falando:'#00FF87',
  };
  const LABEL: Record<EstadoIA, string> = {
    idle:'Toque ou diga "ELECTRA"', aguardando:'Aguardando "ELECTRA"...', escutando:'Ouvindo...', processando:'Pensando...', falando:'Respondendo',
  };
  const ICON: Record<EstadoIA, string> = {
    idle:'🎙', aguardando:'👂', escutando:'🔴', processando:'⚡', falando:'🔊',
  };

  return (
    <>
      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={fechar}>
        <View style={s.overlay}>
          <View style={s.card}>

            <View style={s.header}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                <Animated.View style={[s.headerDot, { backgroundColor:COR[estado], transform:[{scale:pulseAnim}] }]} />
                <Text style={[s.headerTitle, { color:COR[estado] }]}>⚡ ELECTRA</Text>
              </View>
              <TouchableOpacity onPress={fechar} hitSlop={{top:12,bottom:12,left:12,right:12}}>
                <Text style={s.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={s.iconArea}>
              <Animated.View style={[s.ring, s.ring1, { borderColor:COR[estado], opacity:0.3, transform:[{scale:pulseAnim}] }]} />
              <Animated.View style={[s.ring, s.ring2, { borderColor:COR[estado], opacity:0.15 }]} />
              <Animated.View style={[s.iconCircle, { backgroundColor:COR[estado]+'22', borderColor:COR[estado] }, estado==='escutando'&&{ transform:[{scale:pulseAnim}] }]}>
                <Text style={s.iconEmoji}>{ICON[estado]}</Text>
              </Animated.View>
            </View>

            <Text style={[s.statusText, { color:COR[estado] }]}>{LABEL[estado]}</Text>

            {transcricao !== '' && (
              <View style={s.transcBox}>
                <Text style={s.transcLabel}>VOCÊ DISSE</Text>
                <Text style={s.transcText}>"{transcricao}"</Text>
              </View>
            )}

            {resposta !== '' && (
              <View style={[s.respBox, { borderColor:COR['falando']+'44' }]}>
                <Text style={[s.respLabel, { color:COR['falando'] }]}>⚡ ELECTRA</Text>
                <Text style={s.respText}>{resposta}</Text>
              </View>
            )}

            {estado==='escutando' && transcricao==='' && (
              <View style={s.sugestoesWrap}>
                <Text style={s.sugLabel}>EXEMPLOS</Text>
                <View style={s.sugestoesRow}>
                  {['"Posto mais barato"','"Quanto tempo até carregar?"','"Socorro!"','"Meus pontos"'].map(sg => (
                    <View key={sg} style={s.sugChip}>
                      <Text style={s.sugText}>{sg}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {estado==='processando' && (
              <View style={s.loadingBox}>
                <Text style={s.loadingText}>Consultando IA...</Text>
              </View>
            )}

            {/* Botão escutar de novo */}
            {(estado==='idle' || estado==='falando') && (
              <TouchableOpacity style={s.btnNovamente} onPress={iniciarEscuta}>
                <Text style={s.btnNovamenteText}>🎙 Perguntar novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Botão flutuante */}
      <TouchableOpacity onPress={iniciarEscuta} onLongPress={() => setEscutandoWakeWord(v=>!v)} activeOpacity={0.85} style={s.floatWrap}>
        <Animated.View style={[s.floatBtn, { backgroundColor:COR[estado] }, estado!=='idle'&&{ transform:[{scale:pulseAnim}] }]}>
          <Text style={s.floatIcon}>{escutandoWakeWord ? '👂' : ICON[estado]}</Text>
        </Animated.View>
        <Text style={s.floatLabel}>{escutandoWakeWord ? 'OUVINDO...' : 'ELECTRA'}</Text>
      </TouchableOpacity>
    </>
  );
};

const s = StyleSheet.create({
  overlay:  { flex:1, backgroundColor:'rgba(0,0,0,0.75)', justifyContent:'flex-end', padding:16, paddingBottom:100 },
  card:     { backgroundColor:'#070B14', borderWidth:1.5, borderColor:'rgba(0,229,255,0.2)', borderRadius:28, padding:20, paddingBottom:24 },
  header:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:24 },
  headerDot:{ width:10, height:10, borderRadius:5 },
  headerTitle:{ fontFamily:'Syne-Bold', fontSize:17, letterSpacing:1 },
  closeBtn: { fontSize:20, color:'rgba(240,244,255,0.3)', padding:4 },
  iconArea: { alignItems:'center', justifyContent:'center', height:140, marginBottom:16 },
  ring:     { position:'absolute', borderRadius:999, borderWidth:1 },
  ring1:    { width:130, height:130 },
  ring2:    { width:90,  height:90  },
  iconCircle:{ width:68, height:68, borderRadius:34, borderWidth:2, alignItems:'center', justifyContent:'center' },
  iconEmoji:{ fontSize:30 },
  statusText:{ fontFamily:'JetBrainsMono-Regular', fontSize:12, letterSpacing:2, textAlign:'center', marginBottom:16 },
  transcBox: { backgroundColor:'rgba(255,255,255,0.04)', borderRadius:14, padding:14, marginBottom:10 },
  transcLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.3)', letterSpacing:2, marginBottom:6 },
  transcText: { fontFamily:'DMSans-Regular', fontSize:15, color:'rgba(240,244,255,0.85)', fontStyle:'italic' },
  respBox:   { backgroundColor:'rgba(0,255,135,0.05)', borderWidth:1, borderRadius:14, padding:14, marginBottom:10 },
  respLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, letterSpacing:2, marginBottom:6 },
  respText:  { fontFamily:'DMSans-Regular', fontSize:15, color:'#F0F4FF', lineHeight:24 },
  sugestoesWrap:{ marginTop:4 },
  sugLabel:  { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.25)', letterSpacing:2, marginBottom:8 },
  sugestoesRow:{ flexDirection:'row', flexWrap:'wrap', gap:6 },
  sugChip:   { backgroundColor:'rgba(255,255,255,0.05)', borderRadius:20, paddingHorizontal:12, paddingVertical:6, borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  sugText:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.45)' },
  loadingBox:{ alignItems:'center', padding:10 },
  loadingText:{ fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'#FFB800', letterSpacing:1 },
  btnNovamente:{ marginTop:12, height:44, backgroundColor:'rgba(0,229,255,0.1)', borderRadius:14, borderWidth:1, borderColor:'rgba(0,229,255,0.2)', alignItems:'center', justifyContent:'center' },
  btnNovamenteText:{ fontFamily:'Syne-Bold', fontSize:13, color:'#00E5FF' },
  floatWrap: { alignItems:'center' },
  floatBtn:  { width:56, height:56, borderRadius:28, alignItems:'center', justifyContent:'center', shadowColor:'#00E5FF', shadowOpacity:0.5, shadowRadius:16, elevation:10 },
  floatIcon: { fontSize:24 },
  floatLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.35)', letterSpacing:1, marginTop:4 },
});

export default ElectraVoice;
