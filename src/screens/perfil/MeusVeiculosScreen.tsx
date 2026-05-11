import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Alert, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVeiculos } from '../../hooks/useVeiculos';

const MARCAS = [
  'BYD Seal 03','BYD Atto 03','BYD Dolphin','BYD Han',
  'BMW iX','BMW i4','Volvo EX30','Volvo C40',
  'Tesla Model 3','Tesla Model Y','Fiat 500e',
  'Chevrolet Bolt','Renault Kwid E-Tech','GWM Ora 03',
  'Hyundai IONIQ 5','Kia EV6','Outro',
];

export default function MeusVeiculosScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const { veiculos, loading, adicionar, remover, definirPrincipal } = useVeiculos();
  const [adicionando, setAdicionando] = useState(false);
  const [modeloSel, setModeloSel]     = useState('');
  const [placa, setPlaca]             = useState('');
  const [apelido, setApelido]         = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const handleRemover = (id: string) => {
    Alert.alert('Remover veículo','Tem certeza?',[
      { text:'Cancelar', style:'cancel' },
      { text:'Remover', style:'destructive', onPress:() => remover(id) },
    ]);
  };

  const handleAdicionar = async () => {
    if (!modeloSel) { Alert.alert('Selecione um modelo'); return; }
    await adicionar(modeloSel, placa, apelido || modeloSel);
    setModeloSel(''); setPlaca(''); setApelido(''); setAdicionando(false);
  };

  const bc = (b:number) => b<=20?'#FF3B5C':b<=40?'#FFB800':'#00E5FF';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14"/>
      <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Meus Veículos</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => setAdicionando(true)}>
          <Text style={s.addIcon}>＋</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={s.loadingText}>Carregando veículos...</Text>
        ) : veiculos.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyIcon}>🚗</Text>
            <Text style={s.emptyText}>Nenhum veículo cadastrado</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => setAdicionando(true)}>
              <Text style={s.emptyBtnText}>Adicionar veículo</Text>
            </TouchableOpacity>
          </View>
        ) : veiculos.map(v => (
          <View key={v.id} style={[s.card, v.principal && s.cardPrincipal]}>
            <View style={s.cardIcon}>
              <Text style={{fontSize:20}}>🚗</Text>
            </View>
            <View style={s.cardInfo}>
              <Text style={s.cardApelido}>{v.apelido}</Text>
              <Text style={s.cardModelo}>{v.modelo}{v.placa ? ` · ${v.placa}` : ''}</Text>
              {v.principal && <Text style={s.principalBadge}>⭐ Principal</Text>}
            </View>
            <View style={s.cardActions}>
              {!v.principal && (
                <TouchableOpacity onPress={() => definirPrincipal(v.id)} style={s.actionBtn}>
                  <Text style={s.actionText}>Principal</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleRemover(v.id)} style={[s.actionBtn, s.actionRemove]}>
                <Text style={[s.actionText, {color:'#FF3B5C'}]}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {adicionando && (
          <View style={s.addForm}>
            <Text style={s.formTitle}>Novo Veículo</Text>

            <TouchableOpacity style={s.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
              <Text style={modeloSel ? s.dropdownSelected : s.dropdownPlaceholder}>
                {modeloSel || 'Selecionar modelo...'}
              </Text>
              <Text style={s.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={s.dropdownList}>
                {MARCAS.map(m => (
                  <TouchableOpacity key={m} style={s.dropdownItem}
                    onPress={() => { setModeloSel(m); setShowDropdown(false); }}>
                    <Text style={s.dropdownItemText}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              style={s.input}
              placeholder="Apelido (ex: Meu BYD)"
              placeholderTextColor="rgba(240,244,255,0.3)"
              value={apelido}
              onChangeText={setApelido}
            />
            <TextInput
              style={s.input}
              placeholder="Placa (opcional)"
              placeholderTextColor="rgba(240,244,255,0.3)"
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
            />

            <View style={s.formBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setAdicionando(false)}>
                <Text style={s.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleAdicionar}>
                <Text style={s.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:'#070B14' },
  header:     { flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingTop:56, paddingBottom:16 },
  backBtn:    { width:40, height:40, borderRadius:20, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center' },
  backIcon:   { fontSize:18, color:'#F0F4FF' },
  headerTitle:{ flex:1, fontFamily:'Syne-Bold', fontSize:18, color:'#F0F4FF', textAlign:'center' },
  addBtn:     { width:40, height:40, borderRadius:20, backgroundColor:'rgba(0,229,255,0.15)', alignItems:'center', justifyContent:'center' },
  addIcon:    { fontSize:20, color:'#00E5FF' },
  scroll:     { paddingHorizontal:20, paddingBottom:40 },
  loadingText:{ color:'rgba(240,244,255,0.4)', textAlign:'center', marginTop:40 },
  emptyWrap:  { alignItems:'center', paddingTop:60 },
  emptyIcon:  { fontSize:48, marginBottom:12 },
  emptyText:  { fontFamily:'DMSans-Regular', fontSize:16, color:'rgba(240,244,255,0.4)', marginBottom:20 },
  emptyBtn:   { backgroundColor:'rgba(0,229,255,0.15)', borderRadius:12, paddingHorizontal:24, paddingVertical:12 },
  emptyBtnText:{ fontFamily:'Syne-Bold', fontSize:14, color:'#00E5FF' },
  card:       { flexDirection:'row', alignItems:'center', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14, marginBottom:10 },
  cardPrincipal:{ borderColor:'rgba(0,229,255,0.3)' },
  cardIcon:   { width:42, height:42, borderRadius:12, backgroundColor:'rgba(0,229,255,0.1)', alignItems:'center', justifyContent:'center', marginRight:12 },
  cardInfo:   { flex:1 },
  cardApelido:{ fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF' },
  cardModelo: { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },
  principalBadge:{ fontFamily:'DMSans-Regular', fontSize:11, color:'#00E5FF', marginTop:4 },
  cardActions:{ gap:6 },
  actionBtn:  { paddingHorizontal:10, paddingVertical:5, borderRadius:8, backgroundColor:'rgba(255,255,255,0.06)' },
  actionRemove:{ backgroundColor:'rgba(255,59,92,0.1)' },
  actionText: { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.6)' },
  addForm:    { backgroundColor:'#111827', borderRadius:16, padding:20, marginTop:10 },
  formTitle:  { fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF', marginBottom:16 },
  dropdown:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'rgba(255,255,255,0.06)', borderRadius:10, padding:14, marginBottom:10 },
  dropdownSelected:   { fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF' },
  dropdownPlaceholder:{ fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.3)' },
  dropdownArrow:{ color:'rgba(240,244,255,0.4)', fontSize:12 },
  dropdownList:{ backgroundColor:'#1A2235', borderRadius:10, marginBottom:10, maxHeight:200 },
  dropdownItem:{ padding:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.05)' },
  dropdownItemText:{ fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF' },
  input:      { backgroundColor:'rgba(255,255,255,0.06)', borderRadius:10, padding:14, color:'#F0F4FF', fontFamily:'DMSans-Regular', fontSize:14, marginBottom:10 },
  formBtns:   { flexDirection:'row', gap:10, marginTop:6 },
  cancelBtn:  { flex:1, height:44, borderRadius:10, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center' },
  cancelBtnText:{ fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.6)' },
  saveBtn:    { flex:1, height:44, borderRadius:10, backgroundColor:'#00E5FF', alignItems:'center', justifyContent:'center' },
  saveBtnText:{ fontFamily:'Syne-Bold', fontSize:14, color:'#000' },
});
