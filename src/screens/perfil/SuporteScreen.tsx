import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FAQS = [
  { q:'Como iniciar uma recarga?', r:'Vá até a tab Recarga, toque em "Simular Recarga" ou escaneie o QR Code do conector na estação.' },
  { q:'O que fazer quando a bateria zera?', r:'Acesse a tab SOS, pressione e segure o botão vermelho. Um resgatista será despachado em minutos.' },
  { q:'Como adicionar um veículo?', r:'Vá em Perfil → Meus Veículos → toque no botão "+" no canto superior direito.' },
  { q:'Como funciona o ranking?', r:'Você ganha pontos a cada recarga, resgate e conquista. Acesse Perfil → Ranking para ver sua posição.' },
  { q:'Posso pagar com cripto?', r:'Sim! Em Pagamentos você pode usar Bitcoin, Ethereum, USDT e BNB para recargas e serviços.' },
  { q:'Como cancelar uma recarga?', r:'Durante a sessão, toque em "Parar Recarga" e confirme. O valor proporcional será cobrado.' },
  { q:'A ELECTRA funciona offline?', r:'O mapa e histórico funcionam offline. Recargas e SOS precisam de conexão com a internet.' },
];

export default function SuporteScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [faqAberta, setFaqAberta] = useState<number | null>(null);
  const [aba, setAba]             = useState<'faq'|'contato'>('faq');
  const [assunto, setAssunto]     = useState('');
  const [mensagem, setMensagem]   = useState('');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;
    Alert.alert('Mensagem enviada!', 'Nossa equipe responderá em até 24 horas no seu e-mail.');
    setAssunto(''); setMensagem('');
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Suporte</Text>
          <View style={{width:36}} />
        </Animated.View>

        {/* Canais rápidos */}
        <Animated.View style={[s.canaisRow, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          {[
            { icon:'💬', label:'Chat ao vivo', sub:'Resposta imediata', cor:'#00E5FF' },
            { icon:'📧', label:'E-mail', sub:'Até 24 horas', cor:'#00FF87' },
            { icon:'📞', label:'Telefone', sub:'Seg-Sex 9h-18h', cor:'#FFB800' },
          ].map((c,i) => (
            <TouchableOpacity key={i} style={[s.canalCard, { borderColor: c.cor + '33' }]} activeOpacity={0.8}>
              <Text style={{fontSize:24, marginBottom:4}}>{c.icon}</Text>
              <Text style={[s.canalLabel, {color: c.cor}]}>{c.label}</Text>
              <Text style={s.canalSub}>{c.sub}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Abas */}
        <Animated.View style={[s.abas, { opacity:fadeAnim }]}>
          {(['faq','contato'] as const).map(a => (
            <TouchableOpacity key={a} style={[s.aba, aba===a && s.abaActive]} onPress={() => setAba(a)}>
              <Text style={[s.abaText, aba===a && s.abaTextActive]}>
                {a === 'faq' ? '❓ Perguntas Frequentes' : '✉ Falar com Suporte'}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* FAQ */}
        {aba === 'faq' && (
          <Animated.View style={{ opacity:fadeAnim }}>
            {FAQS.map((f, i) => (
              <TouchableOpacity key={i} style={s.faqCard} onPress={() => setFaqAberta(faqAberta===i ? null : i)} activeOpacity={0.8}>
                <View style={s.faqHeader}>
                  <Text style={s.faqQ}>{f.q}</Text>
                  <Text style={[s.faqChevron, faqAberta===i && {transform:[{rotate:'180deg'}]}]}>▼</Text>
                </View>
                {faqAberta === i && (
                  <Text style={s.faqR}>{f.r}</Text>
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Contato */}
        {aba === 'contato' && (
          <Animated.View style={{ opacity:fadeAnim }}>
            <View style={s.contatoCard}>
              <Text style={s.contatoTitle}>Enviar mensagem</Text>

              <Text style={s.inputLabel}>ASSUNTO</Text>
              <View style={s.assuntoRow}>
                {['Recarga', 'SOS', 'Pagamento', 'Bug', 'Outro'].map(a => (
                  <TouchableOpacity key={a} style={[s.assuntoChip, assunto===a && s.assuntoChipActive]} onPress={() => setAssunto(a)}>
                    <Text style={[s.assuntoText, assunto===a && s.assuntoTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[s.inputLabel, {marginTop:14}]}>MENSAGEM</Text>
              <TextInput
                style={s.textarea}
                value={mensagem}
                onChangeText={setMensagem}
                placeholder="Descreva seu problema ou dúvida..."
                placeholderTextColor="rgba(240,244,255,0.2)"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[s.btnEnviar, !mensagem.trim() && {opacity:0.4}]}
                onPress={enviarMensagem}
                activeOpacity={0.85}
              >
                <Text style={s.btnEnviarText}>Enviar mensagem →</Text>
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={s.infoCard}>
              <Text style={s.infoTitle}>Tempo de resposta</Text>
              {[
                { tipo:'Chat ao vivo', tempo:'Imediato', cor:'#00FF87' },
                { tipo:'E-mail',       tempo:'Até 24h',  cor:'#00E5FF' },
                { tipo:'Telefone',     tempo:'Seg-Sex 9h-18h', cor:'#FFB800' },
              ].map((r,i) => (
                <View key={i} style={s.respostaRow}>
                  <Text style={s.respostaTipo}>{r.tipo}</Text>
                  <Text style={[s.respostaTempo, {color:r.cor}]}>{r.tempo}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <View style={{height:40}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16 },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:16, marginBottom:20 },
  backBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'#1A2236', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },
  backArrow:{ fontSize:18, color:'rgba(240,244,255,0.6)' },
  headerTitle:{ fontFamily:'Syne-Bold', fontSize:17, color:'#F0F4FF' },

  canaisRow: { flexDirection:'row', gap:8, marginBottom:20 },
  canalCard: { flex:1, backgroundColor:'#111827', borderWidth:1, borderRadius:16, padding:12, alignItems:'center' },
  canalLabel:{ fontFamily:'Syne-Bold', fontSize:12, marginBottom:2 },
  canalSub:  { fontFamily:'DMSans-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', textAlign:'center' },

  abas:         { flexDirection:'row', backgroundColor:'#111827', borderRadius:14, padding:4, marginBottom:16, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  aba:          { flex:1, paddingVertical:9, alignItems:'center', borderRadius:10 },
  abaActive:    { backgroundColor:'#00E5FF' },
  abaText:      { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.5)' },
  abaTextActive:{ fontFamily:'Syne-Bold', fontSize:12, color:'#000' },

  faqCard:   { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, padding:14, marginBottom:8 },
  faqHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', gap:10 },
  faqQ:      { flex:1, fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF', lineHeight:20 },
  faqChevron:{ fontSize:12, color:'rgba(240,244,255,0.4)' },
  faqR:      { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.6)', lineHeight:20, marginTop:10, paddingTop:10, borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.06)' },

  contatoCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginBottom:12 },
  contatoTitle: { fontFamily:'Syne-Bold', fontSize:15, color:'#F0F4FF', marginBottom:16 },
  inputLabel:   { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:8 },
  assuntoRow:   { flexDirection:'row', flexWrap:'wrap', gap:6 },
  assuntoChip:  { paddingHorizontal:12, paddingVertical:6, backgroundColor:'#0D1320', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:20 },
  assuntoChipActive:{ backgroundColor:'rgba(0,229,255,0.15)', borderColor:'#00E5FF' },
  assuntoText:  { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.5)' },
  assuntoTextActive:{ color:'#00E5FF' },
  textarea:     { backgroundColor:'#0D1320', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:12, padding:12, fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF', minHeight:100, marginBottom:14 },
  btnEnviar:    { height:50, backgroundColor:'#00E5FF', borderRadius:14, alignItems:'center', justifyContent:'center' },
  btnEnviarText:{ fontFamily:'Syne-Bold', fontSize:15, color:'#000' },

  infoCard:    { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14 },
  infoTitle:   { fontFamily:'Syne-Bold', fontSize:13, color:'#F0F4FF', marginBottom:12 },
  respostaRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical:7, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.04)' },
  respostaTipo:{ fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.5)' },
  respostaTempo:{ fontFamily:'Syne-Bold', fontSize:13 },
});
