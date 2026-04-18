import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Modal, NativeModules, Alert,
} from 'react-native';

const { SpeechModule } = NativeModules;

type EstadoIA = 'idle' | 'escutando' | 'processando' | 'falando';

const RESPOSTAS: Record<string, string> = {
  'posto':     'Encontrei 3 postos próximos. O mais perto é o Eletroposto Central, a 1 vírgula 2 quilômetros.',
  'bateria':   'Sua bateria está em 42 por cento, com autonomia de 168 quilômetros.',
  'socorro':   'Iniciando chamado de socorro. Resgatista mais próximo a 2 vírgula 3 quilômetros, tempo estimado 8 minutos.',
  'recarga':   'Para iniciar a recarga, escaneie o QR Code no conector da estação.',
  'ranking':   'Você está em quarto lugar com 2840 pontos. Faltam 1070 pontos para o nível Mestre.',
  'ajuda':     'Posso ajudar com: posto próximo, verificar bateria, chamar socorro, iniciar recarga ou ver seu ranking.',
  'olá':       'Olá! Eu sou a ELECTRA, sua assistente de mobilidade elétrica. Como posso ajudar?',
  'oi':        'Oi! Em que posso ajudar você hoje?',
  'obrigado':  'De nada! Estou sempre aqui para ajudar.',
  'distância': 'A estação mais próxima fica a 1 vírgula 2 quilômetros. Quer que eu trace a rota?',
  'preço':     'O preço médio nas estações próximas é de 3 reais e 20 centavos por quilowatt hora.',
  'autonomia': 'Com 42 por cento de bateria você tem aproximadamente 168 quilômetros de autonomia.',
};

const processarComando = (texto: string): string => {
  const t = texto.toLowerCase();
  for (const [chave, resp] of Object.entries(RESPOSTAS)) {
    if (t.includes(chave)) return resp;
  }
  return 'Não entendi completamente. Tente dizer: posto próximo, minha bateria, preciso de socorro, ou diga ajuda para ver todas as opções.';
};

export const ElectraVoice: React.FC = () => {
  const [estado, setEstado]             = useState<EstadoIA>('idle');
  const [transcricao, setTranscricao]   = useState('');
  const [resposta, setResposta]         = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0)).current;
  const pulseLoop  = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    return () => { SpeechModule?.stop(); };
  }, []);

  const iniciarPulso = () => {
    pulseLoop.current = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.25, duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
    ]));
    pulseLoop.current.start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ])).start();
  };

  const pararPulso = () => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
    glowAnim.setValue(0);
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

      setTimeout(async () => {
        const resp = processarComando(texto);
        setResposta(resp);
        setEstado('falando');

        try {
          await SpeechModule.speak(resp);
        } catch {}

        setTimeout(() => {
          setEstado('idle');
          setTimeout(() => setModalVisivel(false), 1000);
        }, 2000);
      }, 500);

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
    idle: 'Diga "Ei ELECTRA"', escutando: 'Ouvindo você...', processando: 'Processando...', falando: 'ELECTRA respondendo',
  };
  const ICON: Record<EstadoIA, string> = {
    idle: '🎙', escutando: '🔴', processando: '⚡', falando: '🔊',
  };

  const glowOpacity = glowAnim.interpolate({ inputRange: [0,1], outputRange: [0.2, 0.6] });

  return (
    <>
      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={fechar}>
        <View style={styles.overlay}>
          <View style={styles.card}>

            {/* Header */}
            <View style={styles.header}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                <Animated.View style={[styles.headerDot, { backgroundColor: COR[estado], opacity: glowOpacity }]} />
                <Text style={[styles.headerTitle, { color: COR[estado] }]}>⚡ ELECTRA</Text>
              </View>
              <TouchableOpacity onPress={fechar} hitSlop={{top:12,bottom:12,left:12,right:12}}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Ícone central animado */}
            <View style={styles.iconArea}>
              {/* Anéis */}
              <Animated.View style={[styles.ring, styles.ring1, { borderColor: COR[estado], opacity: glowOpacity, transform:[{scale: pulseAnim}] }]} />
              <Animated.View style={[styles.ring, styles.ring2, { borderColor: COR[estado], opacity: glowOpacity }]} />

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

            {/* Resposta */}
            {resposta !== '' && (
              <View style={[styles.respBox, { borderColor: COR['falando'] + '44' }]}>
                <Text style={[styles.respLabel, { color: COR['falando'] }]}>⚡ ELECTRA</Text>
                <Text style={styles.respText}>{resposta}</Text>
              </View>
            )}

            {/* Sugestões quando idle */}
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

  floatWrap:  { alignItems:'center' },
  floatBtn:   { width:56, height:56, borderRadius:28, alignItems:'center', justifyContent:'center', shadowColor:'#00E5FF', shadowOpacity:0.5, shadowRadius:16, elevation:10 },
  floatIcon:  { fontSize:24 },
  floatLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.35)', letterSpacing:1, marginTop:4 },
});

export default ElectraVoice;
