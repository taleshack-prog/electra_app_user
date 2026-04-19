import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Modal, NativeModules, Alert,
} from 'react-native';

const { SpeechModule } = NativeModules;

import { ANTHROPIC_KEY } from '../../config/keys';
const ANTHROPIC_API_KEY = ANTHROPIC_KEY;

const SYSTEM_PROMPT = `Você é a ELECTRA, assistente de voz inteligente de um app de carregamento de veículos elétricos no Brasil.

CONTEXTO DO USUÁRIO:
- Nome: João Costa
- Veículo principal: BYD Seal 03
- Bateria atual: 42%
- Autonomia estimada: 168 km
- Localização: São Paulo, SP
- Ranking: #4 com 2.840 pontos
- Nível: Ouro

ESTAÇÕES PRÓXIMAS:
- Eletroposto Central: 1,2km, 150kW DC, R$3,20/kWh, 3 vagas livres
- BYD Charge Hub: 2,7km, 22kW AC, R$2,10/kWh, ocupado
- EV Station Plus: 3,1km, 50kW DC, R$2,80/kWh, 2 vagas livres

SERVIÇOS DISPONÍVEIS:
- Recarga nas estações acima
- SOS Rescue: resgatista a ~2,3km, ~8 minutos
- Marketplace integrado nas estações
- Sistema de pontos e conquistas

INSTRUÇÕES:
- Responda SEMPRE em português brasileiro
- Seja direta, útil e amigável
- Respostas curtas (máximo 3 frases) pois serão lidas em voz alta
- Use dados reais do contexto acima
- Se o usuário precisar de socorro, instrua-o a usar o botão SOS
- Não invente informações que não estão no contexto`;

type EstadoIA = 'idle' | 'escutando' | 'processando' | 'falando';

export const ElectraVoice: React.FC = () => {
  const [estado, setEstado]             = useState<EstadoIA>('idle');
  const [transcricao, setTranscricao]   = useState('');
  const [resposta, setResposta]         = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    return () => { SpeechModule?.stop(); };
  }, []);

  const iniciarPulso = () => {
    pulseLoop.current = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.25, duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
    ]));
    pulseLoop.current.start();
  };

  const pararPulso = () => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  };

  const chamarClaude = async (texto: string): Promise<string> => {
    try {
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
          max_tokens: 150,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: texto }],
        }),
      });

      const data = await response.json();

      console.log('CLAUDE RESPONSE:', JSON.stringify(data));
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      }

      return 'Desculpe, não consegui processar sua solicitação. Tente novamente.';
    } catch (error: any) {
      console.log('CLAUDE ERROR:', error);
      return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
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
      setTranscricao(texto);
      setEstado('processando');

      // Chama o Claude
      const respostaClaude = await chamarClaude(texto);
      setResposta(respostaClaude);
      setEstado('falando');

      // Fala a resposta
      try {
        await SpeechModule.speak(respostaClaude);
      } catch {}

      setTimeout(() => {
        setEstado('idle');
        setTimeout(() => setModalVisivel(false), 1000);
      }, 2000);

    } catch (e: any) {
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
    idle: '#00E5FF', escutando: '#FF3B5C', processando: '#FFB800', falando: '#00FF87',
  };
  const LABEL: Record<EstadoIA, string> = {
    idle: 'Diga "Ei ELECTRA"', escutando: 'Ouvindo você...', processando: 'Consultando IA...', falando: 'ELECTRA respondendo',
  };
  const ICON: Record<EstadoIA, string> = {
    idle: '🎙', escutando: '🔴', processando: '⚡', falando: '🔊',
  };

  return (
    <>
      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={fechar}>
        <View style={styles.overlay}>
          <View style={styles.card}>

            {/* Header */}
            <View style={styles.header}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                <Animated.View style={[styles.headerDot, { backgroundColor: COR[estado], transform:[{scale: pulseAnim}] }]} />
                <Text style={[styles.headerTitle, { color: COR[estado] }]}>⚡ ELECTRA IA</Text>
              </View>
              <TouchableOpacity onPress={fechar} hitSlop={{top:12,bottom:12,left:12,right:12}}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Ícone central */}
            <View style={styles.iconArea}>
              <Animated.View style={[styles.ring, styles.ring1, { borderColor: COR[estado], opacity: 0.3, transform:[{scale: pulseAnim}] }]} />
              <Animated.View style={[styles.ring, styles.ring2, { borderColor: COR[estado], opacity: 0.15 }]} />
              <Animated.View style={[
                styles.iconCircle,
                { backgroundColor: COR[estado] + '22', borderColor: COR[estado] },
                estado === 'escutando' && { transform:[{scale: pulseAnim}] },
              ]}>
                <Text style={styles.iconEmoji}>{ICON[estado]}</Text>
              </Animated.View>
            </View>

            {/* Status */}
            <Text style={[styles.statusText, { color: COR[estado] }]}>{LABEL[estado]}</Text>

            {/* Transcrição */}
            {transcricao !== '' && (
              <View style={styles.transcBox}>
                <Text style={styles.transcLabel}>VOCÊ DISSE</Text>
                <Text style={styles.transcText}>"{transcricao}"</Text>
              </View>
            )}

            {/* Resposta Claude */}
            {resposta !== '' && (
              <View style={[styles.respBox, { borderColor: COR['falando'] + '44' }]}>
                <Text style={[styles.respLabel, { color: COR['falando'] }]}>⚡ ELECTRA</Text>
                <Text style={styles.respText}>{resposta}</Text>
              </View>
            )}

            {/* Sugestões */}
            {estado === 'escutando' && transcricao === '' && (
              <View style={styles.sugestoesWrap}>
                <Text style={styles.sugLabel}>TENTE DIZER</Text>
                <View style={styles.sugestoesRow}>
                  {['"Posto próximo"', '"Minha bateria"', '"Preciso de socorro"', '"Meu ranking"'].map(s => (
                    <View key={s} style={styles.sugChip}>
                      <Text style={styles.sugText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Loading Claude */}
            {estado === 'processando' && (
              <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>Consultando Claude AI...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Botão flutuante */}
      <TouchableOpacity onPress={iniciarEscuta} activeOpacity={0.85} style={styles.floatWrap}>
        <Animated.View style={[
          styles.floatBtn,
          { backgroundColor: COR[estado] },
          estado !== 'idle' && { transform:[{scale: pulseAnim}] },
        ]}>
          <Text style={styles.floatIcon}>{ICON[estado]}</Text>
        </Animated.View>
        <Text style={styles.floatLabel}>ELECTRA</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  overlay:    { flex:1, backgroundColor:'rgba(0,0,0,0.75)', justifyContent:'flex-end', padding:16, paddingBottom:100 },
  card:       { backgroundColor:'#070B14', borderWidth:1.5, borderColor:'rgba(0,229,255,0.2)', borderRadius:28, padding:20, paddingBottom:24 },

  header:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:24 },
  headerDot:   { width:10, height:10, borderRadius:5 },
  headerTitle: { fontFamily:'Syne-Bold', fontSize:17, letterSpacing:1 },
  closeBtn:    { fontSize:20, color:'rgba(240,244,255,0.3)', padding:4 },

  iconArea:   { alignItems:'center', justifyContent:'center', height:160, marginBottom:16 },
  ring:       { position:'absolute', borderRadius:999, borderWidth:1 },
  ring1:      { width:140, height:140 },
  ring2:      { width:100, height:100 },
  iconCircle: { width:72, height:72, borderRadius:36, borderWidth:2, alignItems:'center', justifyContent:'center' },
  iconEmoji:  { fontSize:32 },

  statusText: { fontFamily:'JetBrainsMono-Regular', fontSize:13, letterSpacing:2, textAlign:'center', marginBottom:20 },

  transcBox:   { backgroundColor:'rgba(255,255,255,0.04)', borderRadius:14, padding:14, marginBottom:10 },
  transcLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.3)', letterSpacing:2, marginBottom:6 },
  transcText:  { fontFamily:'DMSans-Regular', fontSize:15, color:'rgba(240,244,255,0.85)', fontStyle:'italic' },

  respBox:   { backgroundColor:'rgba(0,255,135,0.05)', borderWidth:1, borderRadius:14, padding:14, marginBottom:10 },
  respLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, letterSpacing:2, marginBottom:6 },
  respText:  { fontFamily:'DMSans-Regular', fontSize:15, color:'#F0F4FF', lineHeight:24 },

  sugestoesWrap: { marginTop:4 },
  sugLabel:      { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.25)', letterSpacing:2, marginBottom:8 },
  sugestoesRow:  { flexDirection:'row', flexWrap:'wrap', gap:6 },
  sugChip:       { backgroundColor:'rgba(255,255,255,0.05)', borderRadius:20, paddingHorizontal:12, paddingVertical:6, borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  sugText:       { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.45)' },

  loadingBox:  { alignItems:'center', padding:10 },
  loadingText: { fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'#FFB800', letterSpacing:1 },

  floatWrap:  { alignItems:'center' },
  floatBtn:   { width:56, height:56, borderRadius:28, alignItems:'center', justifyContent:'center', shadowColor:'#00E5FF', shadowOpacity:0.5, shadowRadius:16, elevation:10 },
  floatIcon:  { fontSize:24 },
  floatLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.35)', letterSpacing:1, marginTop:4 },
});

export default ElectraVoice;
