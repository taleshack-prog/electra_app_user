import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SECOES = [
  {
    titulo: '1. Aceitação dos Termos',
    conteudo: 'Ao utilizar o aplicativo ELECTRA Rescue, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize o aplicativo. A ELECTRA reserva-se o direito de modificar estes termos a qualquer momento, com aviso prévio de 30 dias.',
  },
  {
    titulo: '2. Descrição do Serviço',
    conteudo: 'O ELECTRA Rescue é uma plataforma de carregamento de veículos elétricos que oferece: localização de estações de recarga, serviço de resgate emergencial (SOS Rescue), marketplace integrado, sistema de gamificação e assistente de voz por IA.',
  },
  {
    titulo: '3. Cadastro e Conta',
    conteudo: 'Para utilizar os serviços, você deve ter no mínimo 18 anos, fornecer informações verdadeiras e manter sua senha segura. Você é responsável por todas as atividades realizadas em sua conta. Em caso de uso não autorizado, notifique-nos imediatamente.',
  },
  {
    titulo: '4. Serviço de Resgate SOS',
    conteudo: 'O serviço SOS Rescue é destinado a emergências reais de veículos elétricos. O uso indevido ou acionamentos falsos resultará em penalidades na avaliação do usuário e possível suspensão da conta. O tempo de resposta é estimado e pode variar conforme disponibilidade.',
  },
  {
    titulo: '5. Pagamentos e Reembolsos',
    conteudo: 'Os pagamentos são processados de forma segura via parceiros certificados (PCI-DSS). Reembolsos são avaliados caso a caso em até 5 dias úteis. Transações com criptomoedas são irreversíveis por natureza da tecnologia blockchain.',
  },
  {
    titulo: '6. Privacidade e LGPD',
    conteudo: 'Seus dados pessoais são tratados conforme nossa Política de Privacidade e a Lei Geral de Proteção de Dados (Lei 13.709/2018). Coletamos apenas dados necessários para prestação dos serviços. Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.',
  },
  {
    titulo: '7. Propriedade Intelectual',
    conteudo: 'Todo o conteúdo do aplicativo ELECTRA Rescue, incluindo marca, design, algoritmos e código-fonte, é protegido por direitos autorais e propriedade intelectual. É proibida qualquer reprodução sem autorização expressa.',
  },
  {
    titulo: '8. Limitação de Responsabilidade',
    conteudo: 'A ELECTRA não se responsabiliza por danos indiretos, incidentais ou consequenciais. Nossa responsabilidade máxima é limitada ao valor pago pelo serviço nos últimos 3 meses. Não garantimos disponibilidade ininterrupta do serviço.',
  },
  {
    titulo: '9. Conduta do Usuário',
    conteudo: 'É proibido usar o aplicativo para fins ilegais, fraudulentos ou que violem direitos de terceiros. O uso abusivo do sistema de avaliações, resgates falsos ou manipulação do ranking resultará em suspensão imediata da conta.',
  },
  {
    titulo: '10. Foro e Legislação',
    conteudo: 'Estes termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias. Tentativa de mediação é obrigatória antes de ação judicial.',
  },
];

export default function TermosUsoScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [secaoAberta, setSecaoAberta] = useState<number | null>(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Termos de Uso</Text>
          <View style={{width:36}} />
        </Animated.View>

        {/* Info */}
        <Animated.View style={[s.infoCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <Text style={s.infoIcon}>📄</Text>
          <View style={{flex:1}}>
            <Text style={s.infoTitle}>Versão 2.1 — Janeiro 2026</Text>
            <Text style={s.infoSub}>Última atualização: 30/01/2026</Text>
          </View>
        </Animated.View>

        {/* Seções */}
        <Animated.View style={{ opacity:fadeAnim }}>
          {SECOES.map((sec, i) => (
            <TouchableOpacity
              key={i}
              style={[s.secaoCard, secaoAberta===i && s.secaoCardAberta]}
              onPress={() => setSecaoAberta(secaoAberta===i ? null : i)}
              activeOpacity={0.8}
            >
              <View style={s.secaoHeader}>
                <Text style={[s.secaoTitulo, secaoAberta===i && {color:'#00E5FF'}]}>{sec.titulo}</Text>
                <Text style={[s.secaoChevron, secaoAberta===i && {color:'#00E5FF'}]}>
                  {secaoAberta===i ? '▲' : '▼'}
                </Text>
              </View>
              {secaoAberta === i && (
                <Text style={s.secaoConteudo}>{sec.conteudo}</Text>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Aceite */}
        <Animated.View style={[s.aceiteCard, { opacity:fadeAnim }]}>
          <Text style={s.aceiteText}>
            ✅ Ao usar o ELECTRA Rescue, você confirma que leu e aceita estes Termos de Uso e nossa Política de Privacidade.
          </Text>
          <Text style={s.aceiteData}>Aceito em: 15/01/2026 — Versão 2.0</Text>
        </Animated.View>

        {/* Contato */}
        <Animated.View style={[s.contatoCard, { opacity:fadeAnim }]}>
          <Text style={s.contatoTitle}>Dúvidas sobre os termos?</Text>
          <Text style={s.contatoText}>juridico@electra.com.br</Text>
          <Text style={s.contatoText}>ELECTRA Mobilidade Elétrica Ltda.</Text>
          <Text style={s.contatoText}>CNPJ: 00.000.000/0001-00</Text>
          <Text style={s.contatoText}>Av. Paulista, 1000 — São Paulo/SP</Text>
        </Animated.View>

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

  infoCard:  { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:'rgba(0,229,255,0.06)', borderWidth:1, borderColor:'rgba(0,229,255,0.15)', borderRadius:14, padding:14, marginBottom:20 },
  infoIcon:  { fontSize:24 },
  infoTitle: { fontFamily:'Syne-Bold', fontSize:13, color:'#F0F4FF' },
  infoSub:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)', marginTop:2 },

  secaoCard:       { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, padding:14, marginBottom:8 },
  secaoCardAberta: { borderColor:'rgba(0,229,255,0.2)' },
  secaoHeader:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', gap:10 },
  secaoTitulo:     { flex:1, fontFamily:'Syne-Bold', fontSize:13, color:'#F0F4FF', lineHeight:20 },
  secaoChevron:    { fontSize:11, color:'rgba(240,244,255,0.4)' },
  secaoConteudo:   { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.6)', lineHeight:22, marginTop:12, paddingTop:12, borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.06)' },

  aceiteCard: { backgroundColor:'rgba(0,255,135,0.06)', borderWidth:1, borderColor:'rgba(0,255,135,0.15)', borderRadius:14, padding:14, marginBottom:12, marginTop:4 },
  aceiteText: { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.7)', lineHeight:20, marginBottom:6 },
  aceiteData: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.3)' },

  contatoCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, padding:14 },
  contatoTitle: { fontFamily:'Syne-Bold', fontSize:13, color:'#F0F4FF', marginBottom:10 },
  contatoText:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', lineHeight:22 },
});
