import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MARCAS = [
  'BYD Seal 03','BYD Atto 03','BYD Dolphin','BYD Han',
  'BMW iX','BMW i4','Volvo EX30','Volvo C40',
  'Tesla Model 3','Tesla Model Y','Fiat 500e',
  'Chevrolet Bolt','Renault Kwid E-Tech','GWM Ora 03',
  'Hyundai IONIQ 5','Kia EV6','Outro',
];

interface Veiculo {
  id: string; modelo: string; placa: string;
  apelido: string; bateria: number; principal: boolean;
}

export default function MeusVeiculosScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    { id:'1', modelo:'BYD Seal 03', placa:'ABC-1234', apelido:'Meu BYD',  bateria:42, principal:true  },
    { id:'2', modelo:'BYD Dolphin', placa:'XYZ-5678', apelido:'Dolphin',  bateria:78, principal:false },
  ]);
  const [adicionando, setAdicionando] = useState(false);
  const [modeloSel, setModeloSel]     = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const remover = (id: string) => {
    Alert.alert('Remover veículo','Tem certeza?',[
      { text:'Cancelar', style:'cancel' },
      { text:'Remover', style:'destructive', onPress:() => setVeiculos(v => v.filter(x => x.id !== id)) },
    ]);
  };

  const definirPrincipal = (id: string) =>
    setVeiculos(v => v.map(x => ({ ...x, principal: x.id === id })));

  const adicionar = () => {
    if (!modeloSel) return;
    setVeiculos(v => [...v, { id:Date.now().toString(), modelo:modeloSel, placa:'', apelido:modeloSel, bateria:0, principal:false }]);
    setModeloSel(''); setAdicionando(false);
  };

  const bc = (b:number) => b<=20?'#FF3B5C':b<=40?'#FFB800':'#00E5FF';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Meus Veículos</Text>
          <TouchableOpacity style={s.addBtn} onPress={() => setAdicionando(true)}>
            <Text style={s.addBtnText}>+</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity:fadeAnim }}>
          {veiculos.map(v => (
            <View key={v.id} style={[s.card, v.principal && s.cardPrincipal]}>
              {v.principal && <View style={s.badge}><Text style={s.badgeText}>⭐ Principal</Text></View>}
              <View style={s.cardTop}>
                <View style={s.iconWrap}><Text style={{fontSize:24}}>🚗</Text></View>
                <View style={{flex:1}}>
                  <Text style={s.apelido}>{v.apelido}</Text>
                  <Text style={s.modelo}>{v.modelo}</Text>
                  <Text style={s.placa}>{v.placa}</Text>
                </View>
              </View>
              <View style={s.batRow}>
                <Text style={s.batLabel}>Bateria</Text>
                <View style={s.batTrack}>
                  <View style={[s.batFill, { width:`${v.bateria}%` as any, backgroundColor:bc(v.bateria) }]} />
                </View>
                <Text style={[s.batPct, { color:bc(v.bateria) }]}>{v.bateria}%</Text>
              </View>
              <View style={s.acoes}>
                {!v.principal && (
                  <TouchableOpacity style={s.btnPrincipal} onPress={() => definirPrincipal(v.id)}>
                    <Text style={s.btnPrincipalText}>Definir como principal</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.btnRemover} onPress={() => remover(v.id)}>
                  <Text style={s.btnRemoverText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Animated.View>

        {adicionando && (
          <View style={s.formCard}>
            <Text style={s.formTitle}>Adicionar Veículo</Text>
            <Text style={s.inputLabel}>MODELO</Text>
            <TouchableOpacity style={[s.inputBox, showDropdown && s.inputFocused]} onPress={() => setShowDropdown(d => !d)}>
              <Text style={[s.inputText, !modeloSel && s.placeholder]}>{modeloSel || 'Selecione o modelo'}</Text>
              <Text style={{color:'rgba(240,244,255,0.4)',fontSize:12}}>{showDropdown?'▲':'▼'}</Text>
            </TouchableOpacity>
            {showDropdown && (
              <View style={s.dropdown}>
                <ScrollView style={{maxHeight:200}} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {MARCAS.map(m => (
                    <TouchableOpacity key={m} style={[s.dropItem, modeloSel===m && s.dropItemActive]}
                      onPress={() => { setModeloSel(m); setShowDropdown(false); }}>
                      <Text style={[s.dropText, modeloSel===m && {color:'#00E5FF'}]}>{m}</Text>
                      {modeloSel===m && <Text style={{color:'#00E5FF'}}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            <View style={[s.acoes, {marginTop:16}]}>
              <TouchableOpacity style={s.btnCancelar} onPress={() => setAdicionando(false)}>
                <Text style={s.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btnSalvar, !modeloSel && {opacity:0.4}]} onPress={adicionar}>
                <Text style={s.btnSalvarText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={s.infoBox}>
          <Text style={{fontSize:16}}>💡</Text>
          <Text style={s.infoText}>O veículo principal é usado para calcular autonomia e alertas da ELECTRA IA.</Text>
        </View>

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
  addBtn: { width:36, height:36, borderRadius:18, backgroundColor:'rgba(0,229,255,0.15)', borderWidth:1, borderColor:'rgba(0,229,255,0.3)', alignItems:'center', justifyContent:'center' },
  addBtnText:{ fontSize:22, color:'#00E5FF', lineHeight:26 },
  card:   { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:20, padding:16, marginBottom:12 },
  cardPrincipal:{ borderColor:'rgba(0,229,255,0.3)' },
  badge:  { backgroundColor:'rgba(255,184,0,0.12)', borderRadius:20, paddingHorizontal:10, paddingVertical:3, alignSelf:'flex-start', marginBottom:10 },
  badgeText:{ fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'#FFB800' },
  cardTop:{ flexDirection:'row', gap:12, marginBottom:14 },
  iconWrap:{ width:48, height:48, borderRadius:14, backgroundColor:'rgba(0,229,255,0.1)', alignItems:'center', justifyContent:'center' },
  apelido:{ fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF' },
  modelo: { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.5)', marginTop:2 },
  placa:  { fontFamily:'JetBrainsMono-Regular', fontSize:12, color:'rgba(240,244,255,0.35)', marginTop:2 },
  batRow: { flexDirection:'row', alignItems:'center', gap:8, marginBottom:14 },
  batLabel:{ fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', width:48 },
  batTrack:{ flex:1, height:6, backgroundColor:'#1A2236', borderRadius:3, overflow:'hidden' },
  batFill: { height:6, borderRadius:3 },
  batPct:  { fontFamily:'JetBrainsMono-Regular', fontSize:11, width:36, textAlign:'right' },
  acoes:   { flexDirection:'row', gap:8 },
  btnPrincipal:{ flex:1, height:36, backgroundColor:'rgba(0,229,255,0.1)', borderWidth:1, borderColor:'rgba(0,229,255,0.25)', borderRadius:10, alignItems:'center', justifyContent:'center' },
  btnPrincipalText:{ fontFamily:'DMSans-Regular', fontSize:12, color:'#00E5FF' },
  btnRemover:{ height:36, paddingHorizontal:14, backgroundColor:'rgba(255,59,92,0.08)', borderWidth:1, borderColor:'rgba(255,59,92,0.2)', borderRadius:10, alignItems:'center', justifyContent:'center' },
  btnRemoverText:{ fontFamily:'DMSans-Regular', fontSize:12, color:'#FF3B5C' },
  formCard:{ backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(0,229,255,0.2)', borderRadius:20, padding:16, marginBottom:12 },
  formTitle:{ fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF', marginBottom:14 },
  inputLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:6 },
  inputBox:{ flexDirection:'row', alignItems:'center', height:50, backgroundColor:'#0D1320', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:12, paddingHorizontal:14 },
  inputFocused:{ borderColor:'#00E5FF' },
  inputText:{ flex:1, fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF' },
  placeholder:{ color:'rgba(240,244,255,0.2)' },
  dropdown:{ backgroundColor:'#0D1320', borderWidth:1, borderColor:'rgba(0,229,255,0.2)', borderRadius:12, marginTop:4, overflow:'hidden' },
  dropItem:{ paddingHorizontal:14, paddingVertical:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.04)' },
  dropItemActive:{ backgroundColor:'rgba(0,229,255,0.08)' },
  dropText:{ fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.7)' },
  btnCancelar:{ flex:1, height:46, borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:12, alignItems:'center', justifyContent:'center' },
  btnCancelarText:{ fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.5)' },
  btnSalvar:{ flex:1, height:46, backgroundColor:'#00E5FF', borderRadius:12, alignItems:'center', justifyContent:'center' },
  btnSalvarText:{ fontFamily:'Syne-Bold', fontSize:14, color:'#000' },
  infoBox:{ flexDirection:'row', alignItems:'flex-start', gap:10, backgroundColor:'rgba(0,229,255,0.05)', borderWidth:1, borderColor:'rgba(0,229,255,0.1)', borderRadius:14, padding:14, marginTop:4 },
  infoText:{ flex:1, fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.4)', lineHeight:20 },
});
