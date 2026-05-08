import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated,
  StatusBar, TouchableOpacity, ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const ESTACOES = [
  { id:'1', nome:'Eletroposto Central', end:'Av. Paulista, 1000',  dist:'1,2km', potencia:'150kW', tipo:'DC', status:'livre',   preco:'R$ 3,20/kWh', rating:4.8, vagas:3, lat:-23.5614, lng:-46.6560 },
  { id:'2', nome:'BYD Charge Hub',      end:'R. Augusta, 400',    dist:'2,7km', potencia:'22kW',  tipo:'AC', status:'ocupado', preco:'R$ 2,10/kWh', rating:4.5, vagas:0, lat:-23.5489, lng:-46.6388 },
  { id:'3', nome:'EV Station Plus',     end:'Av. Faria Lima, 200', dist:'3,1km', potencia:'50kW',  tipo:'DC', status:'livre',   preco:'R$ 2,80/kWh', rating:4.9, vagas:2, lat:-23.5700, lng:-46.6470 },
  { id:'4', nome:'GreenCharge 24h',     end:'R. Oscar Freire, 50', dist:'4,2km', potencia:'75kW',  tipo:'DC', status:'livre',   preco:'R$ 3,00/kWh', rating:4.7, vagas:5, lat:-23.5580, lng:-46.6650 },
];

const MAPA_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body, #map { width:100%; height:100%; background:#0A1628; }
    .leaflet-tile { filter: brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.6); }
    .leaflet-control-attribution { display:none; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  const map = L.map('map', { zoomControl:true, attributionControl:false }).setView([-23.5558, -46.6396], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);
  const estacoes = ${JSON.stringify(ESTACOES)};
  estacoes.forEach(e => {
    const cor = e.status === 'livre' ? '#00FF87' : '#FFB800';
    const icon = L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;border:2px solid ' + cor + ';background:' + cor + '44;box-shadow:0 0 6px ' + cor + '66;"></div>',
      iconSize: [14,14], iconAnchor: [7,7],
    });
    L.marker([e.lat, e.lng], { icon }).addTo(map)
      .on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ tipo:'selectEstacao', id: e.id }));
      });
  });
  const userIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;border-radius:50%;background:#00E5FF;border:2px solid #070B14;box-shadow:0 0 10px #00E5FF88;"></div>',
    iconSize: [14,14], iconAnchor: [7,7],
  });
  L.marker([-23.5558, -46.6396], { icon: userIcon }).addTo(map);
</script>
</body>
</html>`;

export default function MapaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<string|null>(null);
  const [filtro, setFiltro] = useState('Todos');
  const cardAnim = useRef(new Animated.Value(0)).current;

  const estacao = ESTACOES.find(e => e.id === estacaoSelecionada);

  const mostrarCard = (id: string) => {
    setEstacaoSelecionada(id);
    Animated.spring(cardAnim, { toValue:1, friction:8, tension:60, useNativeDriver:true }).start();
  };

  const esconderCard = () => {
    Animated.timing(cardAnim, { toValue:0, duration:200, useNativeDriver:true }).start(() => {
      setEstacaoSelecionada(null);
    });
  };

  const onMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.tipo === 'selectEstacao') mostrarCard(msg.id);
    } catch {}
  };

  const cardY = cardAnim.interpolate({ inputRange:[0,1], outputRange:[300, 0] });
  const FILTROS = ['Todos','DC Fast','AC','Disponível','24h'];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <WebView
        source={{ html: MAPA_HTML }}
        style={StyleSheet.absoluteFillObject}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        originWhitelist={['*']}
        onMessage={onMessage}
      />

      <View style={s.header}>
        <View style={s.headerCard}>
          <Text style={s.headerTitle}>Estações</Text>
          <Text style={s.headerSub}>{ESTACOES.length} encontradas · Toque num pin</Text>
        </View>
        <TouchableOpacity style={s.settingsBtn}>
          <Text style={{fontSize:18}}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={s.filtrosWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtrosContent}>
          {FILTROS.map(f => (
            <TouchableOpacity key={f} onPress={() => setFiltro(f)}
              style={[s.filtroBtn, filtro===f && s.filtroBtnActive]}>
              <Text style={[s.filtroText, filtro===f && s.filtroTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {estacaoSelecionada && estacao && (
        <Animated.View style={[s.cardWrap, { transform:[{translateY: cardY}] }]}>
          <View style={s.card}>
            <TouchableOpacity style={s.closeBtn} onPress={esconderCard}>
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <View style={s.cardHeader}>
              <View style={[s.statusBadge, { backgroundColor: estacao.status==='livre'?'rgba(0,255,135,0.15)':'rgba(255,184,0,0.15)' }]}>
                <View style={[s.statusDot, { backgroundColor: estacao.status==='livre'?'#00FF87':'#FFB800' }]} />
                <Text style={[s.statusText, { color: estacao.status==='livre'?'#00FF87':'#FFB800' }]}>
                  {estacao.status==='livre'?'Disponível':'Ocupado'}
                </Text>
              </View>
              <Text style={s.rating}>★ {estacao.rating}</Text>
            </View>

            <Text style={s.cardNome}>{estacao.nome}</Text>
            <Text style={s.cardEnd}>{estacao.end}</Text>

            <View style={s.infoRow}>
              <Text style={s.infoItem}>⚡ {estacao.potencia}</Text>
              <Text style={s.infoItem}>📍 {estacao.dist}</Text>
              <Text style={s.infoItem}>💰 {estacao.preco}</Text>
            </View>

            {estacao.vagas > 0 && (
              <Text style={s.vagasText}>🔌 {estacao.vagas} vagas livres</Text>
            )}

            <View style={s.cardBtns}>
              <TouchableOpacity style={s.btnNavegar} onPress={esconderCard}>
                <Text style={s.btnNavegarText}>🗺 Navegar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btnRecarregar, estacao.status==='ocupado' && s.btnDisabled]}
                onPress={() => {
                  if (estacao.status !== 'livre') return;
                  esconderCard();
                  navigation.navigate('StationDetail', { estacao });
                }}>
                <Text style={s.btnRecarregarText}>
                  {estacao.status==='livre' ? '⚡ Ver Detalhes' : 'Indisponível'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#0A1628' },
  header:     { position:'absolute', top:48, left:16, right:16, flexDirection:'row', alignItems:'center', gap:10 },
  headerCard: { flex:1, backgroundColor:'rgba(13,19,32,0.92)', borderRadius:14, paddingHorizontal:14, paddingVertical:10, borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  headerTitle:{ fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF' },
  headerSub:  { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)', marginTop:2 },
  settingsBtn:{ width:44, height:44, borderRadius:22, backgroundColor:'rgba(13,19,32,0.92)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },
  filtrosWrap:    { position:'absolute', top:118, left:0, right:0 },
  filtrosContent: { paddingHorizontal:16, gap:8 },
  filtroBtn:      { paddingHorizontal:14, paddingVertical:7, borderRadius:20, backgroundColor:'rgba(13,19,32,0.85)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  filtroBtnActive:{ backgroundColor:'rgba(0,229,255,0.2)', borderColor:'rgba(0,229,255,0.4)' },
  filtroText:     { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.6)' },
  filtroTextActive:{ fontFamily:'Syne-Bold', color:'#00E5FF' },
  cardWrap: { position:'absolute', bottom:90, left:16, right:16 },
  card:     { backgroundColor:'rgba(13,19,32,0.97)', borderRadius:20, padding:16, borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  closeBtn:     { position:'absolute', top:12, right:12, width:28, height:28, borderRadius:14, backgroundColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center', zIndex:10 },
  closeBtnText: { fontSize:12, color:'rgba(240,244,255,0.5)' },
  cardHeader:  { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  statusBadge: { flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  statusDot:   { width:6, height:6, borderRadius:3 },
  statusText:  { fontFamily:'Syne-Bold', fontSize:11 },
  rating:      { fontFamily:'Syne-Bold', fontSize:13, color:'#FFB800' },
  cardNome: { fontFamily:'Syne-Bold', fontSize:17, color:'#F0F4FF', marginBottom:2 },
  cardEnd:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginBottom:10 },
  infoRow:  { flexDirection:'row', gap:12, marginBottom:8 },
  infoItem: { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.6)' },
  vagasText: { fontFamily:'Syne-Bold', fontSize:13, color:'#00FF87', marginBottom:12 },
  cardBtns:       { flexDirection:'row', gap:10 },
  btnNavegar:     { flex:1, height:42, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:12, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  btnNavegarText: { fontFamily:'Syne-Bold', fontSize:13, color:'#F0F4FF' },
  btnRecarregar:     { flex:1, height:42, backgroundColor:'#00E5FF', borderRadius:12, alignItems:'center', justifyContent:'center' },
  btnRecarregarText: { fontFamily:'Syne-Bold', fontSize:13, color:'#000' },
  btnDisabled:       { backgroundColor:'rgba(255,255,255,0.06)' },
});
