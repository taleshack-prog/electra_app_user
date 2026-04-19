import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PLANOS = [
  {
    id: 'bronze',
    nome: 'Bronze',
    preco: 'R$ 19,90',
    periodo: '/mês',
    cor: '#CD7F32',
    corBg: 'rgba(205,127,50,0.1)',
    corBorder: 'rgba(205,127,50,0.3)',
    icon: '🥉',
    resgates: '1 resgate a cada 2 meses',
    descricao: 'Ideal para quem raramente precisa de socorro',
    beneficios: [
      '1 resgate a cada 2 meses',
      'Tempo de resposta padrão (~15 min)',
      'Carga mínima para chegar à estação',
      'Suporte via chat',
      'Acesso ao histórico de resgates',
    ],
    nao_inclui: [
      'Resgates adicionais com desconto',
      'Prioridade no despacho',
      'Assistência 24h premium',
    ],
    popular: false,
  },
  {
    id: 'prata',
    nome: 'Prata',
    preco: 'R$ 39,90',
    periodo: '/mês',
    cor: '#A8A9AD',
    corBg: 'rgba(168,169,173,0.1)',
    corBorder: 'rgba(168,169,173,0.3)',
    icon: '🥈',
    resgates: '2 resgates por mês',
    descricao: 'Para usuários frequentes que valorizam tranquilidade',
    beneficios: [
      '2 resgates por mês',
      'Tempo de resposta prioritário (~10 min)',
      'Carga completa até 80%',
      'Suporte via chat e telefone',
      'Resgates extras com 30% desconto',
      'Notificações proativas de bateria',
    ],
    nao_inclui: [
      'Resgates ilimitados',
      'Assistência VIP 24h',
    ],
    popular: true,
  },
  {
    id: 'ouro',
    nome: 'Ouro',
    preco: 'R$ 69,90',
    periodo: '/mês',
    cor: '#FFB800',
    corBg: 'rgba(255,184,0,0.1)',
    corBorder: 'rgba(255,184,0,0.3)',
    icon: '🥇',
    resgates: '5 resgates por mês',
    descricao: 'Para quem precisa de segurança máxima',
    beneficios: [
      '5 resgates por mês',
      'Tempo de resposta VIP (~7 min)',
      'Carga completa até 100%',
      'Suporte 24h exclusivo',
      'Resgates extras com 50% desconto',
      'IA preditiva de bateria',
      'Relatório mensal de uso',
      'Acesso antecipado a novidades',
    ],
    nao_inclui: [],
    popular: false,
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 129,90',
    periodo: '/mês',
    cor: '#00E5FF',
    corBg: 'rgba(0,229,255,0.1)',
    corBorder: 'rgba(0,229,255,0.3)',
    icon: '⚡',
    resgates: 'Resgates ilimitados',
    descricao: 'Tranquilidade total — para frotas e power users',
    beneficios: [
      'Resgates ILIMITADOS',
      'Tempo de resposta elite (~5 min)',
      'Carga completa garantida',
      'Gerente de conta dedicado',
      'Suporte 24h VIP linha exclusiva',
      'IA preditiva avançada',
      'Gestão de frota integrada',
      'Relatórios avançados',
      'API para integração empresarial',
      'Pontos em dobro no ranking',
    ],
    nao_inclui: [],
    popular: false,
  },
];

export default function PlanosSeguroScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [planoAtivo] = useState('prata');
  const [selecionado, setSelecionado] = useState('prata');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const handleAssinar = (planoId: string) => {
    const plano = PLANOS.find(p => p.id === planoId);
    Alert.alert(
      `Assinar plano ${plano?.nome}`,
      `${plano?.preco}/mês — ${plano?.resgates}\n\nDeseja continuar para o pagamento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Assinar', onPress: () =>
          Alert.alert('✅ Assinatura ativada!', `Plano ${plano?.nome} ativado com sucesso. Sua cobertura começa agora.`)
        },
      ]
    );
  };

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar assinatura',
      'Tem certeza? Você perderá todos os benefícios do plano atual ao final do período.',
      [
        { text: 'Manter plano', style: 'cancel' },
        { text: 'Cancelar', style: 'destructive', onPress: () =>
          Alert.alert('Assinatura cancelada', 'Seu plano ficará ativo até o final do período pago.')
        },
      ]
    );
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Planos Rescue</Text>
          <View style={{width:36}} />
        </Animated.View>

        {/* Hero */}
        <Animated.View style={[s.heroCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <Text style={s.heroIcon}>🛡</Text>
          <Text style={s.heroTitle}>Seguro Rescue ELECTRA</Text>
          <Text style={s.heroSub}>
            Nunca fique preso com bateria vazia. Escolha o plano ideal para sua rotina.
          </Text>
          <View style={s.heroBadge}>
            <Text style={s.heroBadgeText}>⚡ Plano atual: Prata</Text>
          </View>
        </Animated.View>

        {/* Planos */}
        {PLANOS.map(plano => (
          <Animated.View key={plano.id} style={[{ opacity:fadeAnim }]}>
            <TouchableOpacity
              style={[
                s.planoCard,
                { borderColor: selecionado === plano.id ? plano.cor : 'rgba(255,255,255,0.08)' },
                selecionado === plano.id && { backgroundColor: plano.corBg },
              ]}
              onPress={() => setSelecionado(plano.id)}
              activeOpacity={0.85}
            >
              {/* Badge popular */}
              {plano.popular && (
                <View style={[s.popularBadge, { backgroundColor: plano.corBg, borderColor: plano.cor }]}>
                  <Text style={[s.popularText, { color: plano.cor }]}>⭐ Mais popular</Text>
                </View>
              )}

              {/* Header do plano */}
              <View style={s.planoHeader}>
                <View style={s.planoIconWrap}>
                  <Text style={s.planoIcon}>{plano.icon}</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={[s.planoNome, { color: plano.cor }]}>{plano.nome}</Text>
                  <Text style={s.planoDesc}>{plano.descricao}</Text>
                </View>
                <View style={{alignItems:'flex-end'}}>
                  <Text style={[s.planoPreco, { color: plano.cor }]}>{plano.preco}</Text>
                  <Text style={s.planoPeriodo}>{plano.periodo}</Text>
                </View>
              </View>

              {/* Destaque resgates */}
              <View style={[s.resgatesBox, { backgroundColor: plano.corBg, borderColor: plano.cor + '44' }]}>
                <Text style={s.resgatesIcon}>🆘</Text>
                <Text style={[s.resgatesText, { color: plano.cor }]}>{plano.resgates}</Text>
              </View>

              {/* Benefícios */}
              {selecionado === plano.id && (
                <View style={s.beneficiosWrap}>
                  <Text style={s.beneficiosLabel}>INCLUÍDO</Text>
                  {plano.beneficios.map((b, i) => (
                    <View key={i} style={s.beneficioItem}>
                      <Text style={[s.beneficioCheck, { color: plano.cor }]}>✓</Text>
                      <Text style={s.beneficioText}>{b}</Text>
                    </View>
                  ))}
                  {plano.nao_inclui.length > 0 && (
                    <>
                      <Text style={[s.beneficiosLabel, { marginTop:10, color:'rgba(240,244,255,0.25)' }]}>NÃO INCLUÍDO</Text>
                      {plano.nao_inclui.map((b, i) => (
                        <View key={i} style={s.beneficioItem}>
                          <Text style={s.naoIncluiCheck}>✕</Text>
                          <Text style={s.naoIncluiText}>{b}</Text>
                        </View>
                      ))}
                    </>
                  )}

                  {/* Botão assinar */}
                  {planoAtivo !== plano.id ? (
                    <TouchableOpacity
                      style={[s.btnAssinar, { backgroundColor: plano.cor }]}
                      onPress={() => handleAssinar(plano.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={s.btnAssinarText}>
                        {PLANOS.findIndex(p=>p.id===plano.id) > PLANOS.findIndex(p=>p.id===planoAtivo)
                          ? `Fazer upgrade para ${plano.nome}`
                          : `Mudar para ${plano.nome}`}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={[s.btnAtivo, { borderColor: plano.cor }]}>
                      <Text style={[s.btnAtivoText, { color: plano.cor }]}>✓ Plano atual</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Comparativo */}
        <Animated.View style={[s.comparativoCard, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>COMPARATIVO DE RESGATES</Text>
          <View style={s.comparativoRow}>
            {PLANOS.map(p => (
              <View key={p.id} style={s.comparativoItem}>
                <Text style={{fontSize:20}}>{p.icon}</Text>
                <Text style={[s.comparativoNome, { color: p.cor }]}>{p.nome}</Text>
                <Text style={s.comparativoPreco}>{p.preco}</Text>
                <Text style={s.comparativoResgates}>
                  {p.id === 'bronze' ? '0,5/mês' :
                   p.id === 'prata'  ? '2/mês' :
                   p.id === 'ouro'   ? '5/mês' : '∞'}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Cancelar */}
        <Animated.View style={[{ opacity:fadeAnim, marginBottom:8 }]}>
          <TouchableOpacity style={s.btnCancelar} onPress={handleCancelar}>
            <Text style={s.btnCancelarText}>Cancelar assinatura atual</Text>
          </TouchableOpacity>
          <Text style={s.cancelarInfo}>
            Ao cancelar, o plano permanece ativo até o fim do período pago.
          </Text>
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

  heroCard:  { backgroundColor:'rgba(0,229,255,0.06)', borderWidth:1, borderColor:'rgba(0,229,255,0.15)', borderRadius:22, padding:20, marginBottom:20, alignItems:'center' },
  heroIcon:  { fontSize:40, marginBottom:10 },
  heroTitle: { fontFamily:'Syne-Bold', fontSize:20, color:'#F0F4FF', marginBottom:6, textAlign:'center' },
  heroSub:   { fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.5)', textAlign:'center', lineHeight:22, marginBottom:12 },
  heroBadge: { backgroundColor:'rgba(168,169,173,0.15)', borderRadius:20, paddingHorizontal:14, paddingVertical:5, borderWidth:1, borderColor:'rgba(168,169,173,0.3)' },
  heroBadgeText:{ fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'#A8A9AD' },

  planoCard:      { backgroundColor:'#111827', borderWidth:1.5, borderRadius:22, padding:16, marginBottom:12 },
  popularBadge:   { alignSelf:'flex-start', borderWidth:1, borderRadius:20, paddingHorizontal:10, paddingVertical:3, marginBottom:10 },
  popularText:    { fontFamily:'JetBrainsMono-Regular', fontSize:10 },
  planoHeader:    { flexDirection:'row', alignItems:'flex-start', gap:10, marginBottom:12 },
  planoIconWrap:  { width:44, height:44, borderRadius:12, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center' },
  planoIcon:      { fontSize:22 },
  planoNome:      { fontFamily:'Syne-Bold', fontSize:18, marginBottom:2 },
  planoDesc:      { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', lineHeight:17 },
  planoPreco:     { fontFamily:'Syne-Bold', fontSize:20 },
  planoPeriodo:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)' },

  resgatesBox:  { flexDirection:'row', alignItems:'center', gap:8, borderWidth:1, borderRadius:12, padding:10, marginBottom:8 },
  resgatesIcon: { fontSize:16 },
  resgatesText: { fontFamily:'Syne-Bold', fontSize:14 },

  beneficiosWrap:  { marginTop:10, paddingTop:10, borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.06)' },
  beneficiosLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.3)', letterSpacing:2, marginBottom:8 },
  beneficioItem:   { flexDirection:'row', alignItems:'flex-start', gap:8, marginBottom:6 },
  beneficioCheck:  { fontSize:13, fontWeight:'bold', width:16 },
  beneficioText:   { flex:1, fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.7)', lineHeight:19 },
  naoIncluiCheck:  { fontSize:13, color:'rgba(240,244,255,0.2)', width:16 },
  naoIncluiText:   { flex:1, fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.25)', lineHeight:19 },

  btnAssinar:     { height:48, borderRadius:14, alignItems:'center', justifyContent:'center', marginTop:14 },
  btnAssinarText: { fontFamily:'Syne-Bold', fontSize:14, color:'#000' },
  btnAtivo:       { height:48, borderRadius:14, borderWidth:1.5, alignItems:'center', justifyContent:'center', marginTop:14 },
  btnAtivoText:   { fontFamily:'Syne-Bold', fontSize:14 },

  comparativoCard: { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginBottom:16 },
  sectionLabel:    { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:12 },
  comparativoRow:  { flexDirection:'row', gap:4 },
  comparativoItem: { flex:1, alignItems:'center', gap:4 },
  comparativoNome: { fontFamily:'Syne-Bold', fontSize:11 },
  comparativoPreco:{ fontFamily:'DMSans-Regular', fontSize:10, color:'rgba(240,244,255,0.4)', textAlign:'center' },
  comparativoResgates:{ fontFamily:'JetBrainsMono-Regular', fontSize:12, color:'#F0F4FF' },

  btnCancelar:    { height:44, borderWidth:1, borderColor:'rgba(255,59,92,0.2)', borderRadius:12, alignItems:'center', justifyContent:'center', marginBottom:6 },
  btnCancelarText:{ fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(255,59,92,0.6)' },
  cancelarInfo:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.25)', textAlign:'center', lineHeight:17 },
});
