import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Cartao {
  id: string; bandeira: string; final: string;
  validade: string; principal: boolean;
}

export default function PagamentosScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [cartoes, setCartoes] = useState<Cartao[]>([
    { id:'1', bandeira:'Visa',       final:'4242', validade:'12/27', principal:true  },
    { id:'2', bandeira:'Mastercard', final:'5555', validade:'08/26', principal:false },
  ]);
  const [saldoCarteira] = useState(125.50);
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const removerCartao = (id: string) => {
    Alert.alert('Remover cartão','Tem certeza?',[
      { text:'Cancelar', style:'cancel' },
      { text:'Remover', style:'destructive', onPress:() => setCartoes(c => c.filter(x => x.id !== id)) },
    ]);
  };

  const definirPrincipal = (id: string) =>
    setCartoes(c => c.map(x => ({ ...x, principal: x.id === id })));

  const bandeiraCor = (b: string) => b === 'Visa' ? '#1A1F71' : b === 'Mastercard' ? '#EB001B' : '#00A651';
  const bandeiraEmoji = (b: string) => b === 'Visa' ? '💳' : b === 'Mastercard' ? '💳' : '💳';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Pagamentos</Text>
          <View style={{width:36}} />
        </Animated.View>

        {/* Carteira digital */}
        <Animated.View style={[s.carteiraCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <View style={s.carteiraTop}>
            <View>
              <Text style={s.carteiraLabel}>CARTEIRA ELECTRA</Text>
              <Text style={s.carteiraSaldo}>R$ {saldoCarteira.toFixed(2)}</Text>
              <Text style={s.carteiraSub}>Saldo disponível</Text>
            </View>
            <View style={s.carteiraIcon}>
              <Text style={{fontSize:28}}>⚡</Text>
            </View>
          </View>
          <View style={s.carteiraBtns}>
            <TouchableOpacity style={s.carteiraBtn}>
              <Text style={s.carteiraBtnText}>+ Adicionar saldo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.carteiraBtn, s.carteiraBtnPix]}>
              <Text style={[s.carteiraBtnText, {color:'#00FF87'}]}>PIX</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Cartões */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionLabel}>CARTÕES SALVOS</Text>
            <TouchableOpacity onPress={() => setAdicionando(true)}>
              <Text style={s.addLink}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>

          {cartoes.map(c => (
            <View key={c.id} style={[s.cartaoCard, c.principal && s.cartaoCardPrincipal]}>
              {c.principal && (
                <View style={s.badge}><Text style={s.badgeText}>✓ Principal</Text></View>
              )}
              <View style={s.cartaoTop}>
                <View style={[s.cartaoIcon, { backgroundColor: bandeiraCor(c.bandeira) + '22', borderColor: bandeiraCor(c.bandeira) + '44' }]}>
                  <Text style={{fontSize:22}}>💳</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={s.cartaoBandeira}>{c.bandeira}</Text>
                  <Text style={s.cartaoFinal}>•••• •••• •••• {c.final}</Text>
                  <Text style={s.cartaoValidade}>Válido até {c.validade}</Text>
                </View>
              </View>
              <View style={s.cartaoAcoes}>
                {!c.principal && (
                  <TouchableOpacity style={s.btnPrincipal} onPress={() => definirPrincipal(c.id)}>
                    <Text style={s.btnPrincipalText}>Definir como principal</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.btnRemover} onPress={() => removerCartao(c.id)}>
                  <Text style={s.btnRemoverText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {adicionando && (
            <View style={s.formCard}>
              <Text style={s.formTitle}>Adicionar Cartão</Text>
              <View style={s.formField}>
                <Text style={s.inputLabel}>NÚMERO DO CARTÃO</Text>
                <View style={s.inputBox}>
                  <Text style={s.placeholder}>•••• •••• •••• ••••</Text>
                </View>
              </View>
              <View style={{flexDirection:'row', gap:10}}>
                <View style={{flex:1}}>
                  <Text style={s.inputLabel}>VALIDADE</Text>
                  <View style={s.inputBox}>
                    <Text style={s.placeholder}>MM/AA</Text>
                  </View>
                </View>
                <View style={{flex:1}}>
                  <Text style={s.inputLabel}>CVV</Text>
                  <View style={s.inputBox}>
                    <Text style={s.placeholder}>•••</Text>
                  </View>
                </View>
              </View>
              <View style={[s.cartaoAcoes, {marginTop:14}]}>
                <TouchableOpacity style={s.btnCancelar} onPress={() => setAdicionando(false)}>
                  <Text style={s.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnSalvar} onPress={() => setAdicionando(false)}>
                  <Text style={s.btnSalvarText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Métodos aceitos */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>MÉTODOS ACEITOS</Text>
          <View style={s.metodosGrid}>
            {[
              { icon:'💳', label:'Visa / Master' },
              { icon:'📱', label:'PIX' },
              { icon:'₿',  label:'Bitcoin' },
              { icon:'🔷', label:'Ethereum' },
              { icon:'💲', label:'USDT' },
              { icon:'🟡', label:'BNB' },
            ].map((m,i) => (
              <View key={i} style={s.metodoItem}>
                <Text style={{fontSize:20}}>{m.icon}</Text>
                <Text style={s.metodoLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Histórico */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>ÚLTIMAS TRANSAÇÕES</Text>
          {[
            { desc:'Recarga · Eletroposto Central', data:'Hoje', val:'-R$ 104,00', cor:'#FF3B5C' },
            { desc:'Recarga · BYD Charge Hub',      data:'Ontem', val:'-R$ 38,22',  cor:'#FF3B5C' },
            { desc:'Saldo adicionado via PIX',       data:'15/04', val:'+R$ 200,00', cor:'#00FF87' },
            { desc:'Recarga · EV Station Plus',      data:'12/04', val:'-R$ 126,00', cor:'#FF3B5C' },
          ].map((t,i) => (
            <View key={i} style={s.transacaoItem}>
              <View style={{flex:1}}>
                <Text style={s.transacaoDesc}>{t.desc}</Text>
                <Text style={s.transacaoData}>{t.data}</Text>
              </View>
              <Text style={[s.transacaoVal, {color:t.cor}]}>{t.val}</Text>
            </View>
          ))}
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

  carteiraCard:{ background:'linear-gradient(135deg,#00E5FF22,#00FF8722)', backgroundColor:'rgba(0,229,255,0.08)', borderWidth:1.5, borderColor:'rgba(0,229,255,0.25)', borderRadius:22, padding:18, marginBottom:20 } as any,
  carteiraTop: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  carteiraLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(0,229,255,0.6)', letterSpacing:2, marginBottom:6 },
  carteiraSaldo:{ fontFamily:'Syne-Bold', fontSize:36, color:'#F0F4FF', letterSpacing:-1 },
  carteiraSub:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },
  carteiraIcon: { width:56, height:56, borderRadius:28, backgroundColor:'rgba(0,229,255,0.1)', alignItems:'center', justifyContent:'center' },
  carteiraBtns: { flexDirection:'row', gap:8 },
  carteiraBtn:  { flex:1, height:40, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:10, alignItems:'center', justifyContent:'center' },
  carteiraBtnPix:{ borderColor:'rgba(0,255,135,0.3)', backgroundColor:'rgba(0,255,135,0.06)' },
  carteiraBtnText:{ fontFamily:'Syne-Bold', fontSize:13, color:'rgba(240,244,255,0.7)' },

  section:       { marginBottom:20 },
  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  sectionLabel:  { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2 },
  addLink:       { fontFamily:'DMSans-Regular', fontSize:13, color:'#00E5FF' },

  cartaoCard:         { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:18, padding:14, marginBottom:10 },
  cartaoCardPrincipal:{ borderColor:'rgba(0,229,255,0.3)' },
  badge:    { backgroundColor:'rgba(0,229,255,0.1)', borderRadius:20, paddingHorizontal:10, paddingVertical:3, alignSelf:'flex-start', marginBottom:10 },
  badgeText:{ fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'#00E5FF' },
  cartaoTop:{ flexDirection:'row', gap:12, marginBottom:12, alignItems:'center' },
  cartaoIcon:{ width:44, height:44, borderRadius:12, borderWidth:1, alignItems:'center', justifyContent:'center' },
  cartaoBandeira:{ fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF' },
  cartaoFinal:{ fontFamily:'JetBrainsMono-Regular', fontSize:13, color:'rgba(240,244,255,0.6)', marginTop:2 },
  cartaoValidade:{ fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.35)', marginTop:2 },
  cartaoAcoes:{ flexDirection:'row', gap:8 },
  btnPrincipal:{ flex:1, height:34, backgroundColor:'rgba(0,229,255,0.1)', borderWidth:1, borderColor:'rgba(0,229,255,0.25)', borderRadius:8, alignItems:'center', justifyContent:'center' },
  btnPrincipalText:{ fontFamily:'DMSans-Regular', fontSize:12, color:'#00E5FF' },
  btnRemover:{ height:34, paddingHorizontal:12, backgroundColor:'rgba(255,59,92,0.08)', borderWidth:1, borderColor:'rgba(255,59,92,0.2)', borderRadius:8, alignItems:'center', justifyContent:'center' },
  btnRemoverText:{ fontFamily:'DMSans-Regular', fontSize:12, color:'#FF3B5C' },

  formCard:  { backgroundColor:'rgba(0,229,255,0.04)', borderWidth:1, borderColor:'rgba(0,229,255,0.15)', borderRadius:16, padding:14, marginBottom:10 },
  formTitle: { fontFamily:'Syne-Bold', fontSize:15, color:'#F0F4FF', marginBottom:14 },
  formField: { marginBottom:12 },
  inputLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:6 },
  inputBox:  { height:48, backgroundColor:'#0D1320', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:10, paddingHorizontal:14, justifyContent:'center' },
  placeholder:{ fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.2)' },
  btnCancelar:{ flex:1, height:44, borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:10, alignItems:'center', justifyContent:'center' },
  btnCancelarText:{ fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.5)' },
  btnSalvar:  { flex:1, height:44, backgroundColor:'#00E5FF', borderRadius:10, alignItems:'center', justifyContent:'center' },
  btnSalvarText:{ fontFamily:'Syne-Bold', fontSize:13, color:'#000' },

  metodosGrid:{ flexDirection:'row', flexWrap:'wrap', gap:8 },
  metodoItem: { width:'30%', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:12, padding:12, alignItems:'center', gap:6 },
  metodoLabel:{ fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.5)', textAlign:'center' },

  transacaoItem:{ flexDirection:'row', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.04)' },
  transacaoDesc:{ fontFamily:'DMSans-Regular', fontSize:13, color:'#F0F4FF' },
  transacaoData:{ fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.35)', marginTop:2 },
  transacaoVal: { fontFamily:'Syne-Bold', fontSize:14 },
});
