import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated,
  StatusBar, TouchableOpacity, ScrollView, PermissionsAndroid, Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useStations } from '../../hooks/useStations';

const DEFAULT_LAT = -30.0346; // Porto Alegre fallback
const DEFAULT_LNG = -51.2177;

export default function MapaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { stations, loading } = useStations();

  const [userLat, setUserLat] = useState<number>(DEFAULT_LAT);
  const [userLng, setUserLng] = useState<number>(DEFAULT_LNG);
  const [gpsOk, setGpsOk]     = useState(false);
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<string|null>(null);
  const [filtro, setFiltro]   = useState('Todos');
  const cardAnim = useRef(new Animated.Value(0)).current;
  const webRef   = useRef<any>(null);

  // Pede GPS ao montar
  useEffect(() => {
    pedirLocalizacao();
  }, []);

  // Quando GPS ou estações mudam, atualiza o mapa
  useEffect(() => {
    if (!loading && stations.length > 0) {
      atualizarMapa();
    }
  }, [userLat, userLng, stations, loading]);

  const pedirLocalizacao = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'ELECTRA precisa da sua localização',
          message: 'Para mostrar estações próximas a você.',
          buttonPositive: 'Permitir',
          buttonNegative: 'Agora não',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
    }
    Geolocation.getCurrentPosition(
      pos => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setGpsOk(true);
      },
      () => {
        // fallback para POA se GPS falhar
        setUserLat(DEFAULT_LAT);
        setUserLng(DEFAULT_LNG);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const atualizarMapa = () => {
    if (!webRef.current) return;
    const script = `
      if (window.atualizarPosicao) {
        window.atualizarPosicao(${userLat}, ${userLng}, ${JSON.stringify(stations)});
      }
      true;
    `;
    webRef.current.injectJavaScript(script);
  };

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
  const map = L.map('map', { zoomControl:true, attributionControl:false })
    .setView([${userLat}, ${userLng}], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);

  let userMarker = null;
  let estacaoMarkers = [];

  const userIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;border-radius:50%;background:#00E5FF;border:2px solid #070B14;box-shadow:0 0 10px #00E5FF88;"></div>',
    iconSize: [14,14], iconAnchor: [7,7],
  });

  function renderEstacoes(estacoes) {
    estacaoMarkers.forEach(m => map.removeLayer(m));
    estacaoMarkers = [];
    estacoes.forEach(e => {
      const disponivel = e.status === 'online' && e.conectores_livres > 0;
      const cor = disponivel ? '#00FF87' : '#FFB800';
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:14px;height:14px;border-radius:50%;border:2px solid ' + cor + ';background:' + cor + '44;box-shadow:0 0 6px ' + cor + '66;"></div>',
        iconSize: [14,14], iconAnchor: [7,7],
      });
      const marker = L.marker([e.latitude, e.longitude], { icon })
        .addTo(map)
        .on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ tipo:'selectEstacao', id: e.id }));
        });
      estacaoMarkers.push(marker);
    });
  }

  function atualizarPosicao(lat, lng, estacoes) {
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    map.setView([lat, lng], 13);
    renderEstacoes(estacoes);
  }

  window.atualizarPosicao = atualizarPosicao;

  // Renderiza estações iniciais se já disponíveis
  const initialStations = ${JSON.stringify(stations)};
  if (initialStations.length > 0) renderEstacoes(initialStations);

  // Pin usuário inicial
  userMarker = L.marker([${userLat}, ${userLng}], { icon: userIcon }).addTo(map);
</script>
</body>
</html>`;

  const estacao = stations.find(e => e.id === estacaoSelecionada);

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

  // Distância em km (Haversine simplificado)
  const distancia = (lat: number, lng: number) => {
    const R = 6371;
    const dLat = (lat - userLat) * Math.PI / 180;
    const dLng = (lng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(userLat * Math.PI/180) * Math.cos(lat * Math.PI/180) * Math.sin(dLng/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <WebView
        ref={webRef}
        source={{ html: MAPA_HTML }}
        style={StyleSheet.absoluteFillObject}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        originWhitelist={['*']}
        onMessage={onMessage}
      />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerCard}>
          <Text style={s.headerTitle}>Estações</Text>
          <Text style={s.headerSub}>
            {loading ? 'Carregando...' : `${stations.length} encontradas`}
            {gpsOk ? ' · GPS ativo' : ' · Porto Alegre'}
          </Text>
        </View>
        <TouchableOpacity style={s.settingsBtn} onPress={pedirLocalizacao}>
          <Text style={{fontSize:18}}>◎</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
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

      {/* Card estação */}
      {estacaoSelecionada && estacao && (
        <Animated.View style={[s.cardWrap, { transform:[{translateY: cardY}] }]}>
          <View style={s.card}>
            <TouchableOpacity style={s.closeBtn} onPress={esconderCard}>
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <View style={s.cardHeader}>
              <View style={[s.statusBadge, {
                backgroundColor: estacao.conectores_livres > 0 ? 'rgba(0,255,135,0.15)' : 'rgba(255,184,0,0.15)'
              }]}>
                <View style={[s.statusDot, {
                  backgroundColor: estacao.conectores_livres > 0 ? '#00FF87' : '#FFB800'
                }]} />
                <Text style={[s.statusText, {
                  color: estacao.conectores_livres > 0 ? '#00FF87' : '#FFB800'
                }]}>
                  {estacao.conectores_livres > 0 ? `${estacao.conectores_livres} livres` : 'Ocupado'}
                </Text>
              </View>
              <Text style={s.rating}>📍 {distancia(estacao.latitude, estacao.longitude)} km</Text>
            </View>

            <Text style={s.cardNome}>{estacao.nome}</Text>
            <Text style={s.cardEnd}>{estacao.endereco}</Text>

            <View style={s.infoRow}>
              <Text style={s.infoItem}>⚡ {estacao.potencia_kw}kW</Text>
              <Text style={s.infoItem}>🔌 {estacao.tipo}</Text>
              <Text style={s.infoItem}>💰 R$ {estacao.preco_kwh}/kWh</Text>
            </View>

            <View style={s.cardBtns}>
              <TouchableOpacity style={s.btnNavegar} onPress={esconderCard}>
                <Text style={s.btnNavegarText}>🗺 Navegar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btnRecarregar, estacao.conectores_livres === 0 && s.btnDisabled]}
                onPress={() => {
                  if (estacao.conectores_livres === 0) return;
                  esconderCard();
                  navigation.navigate('StationDetail', {
                    estacao: {
                      id: estacao.id,
                      nome: estacao.nome,
                      end: estacao.endereco,
                      dist: `${distancia(estacao.latitude, estacao.longitude)}km`,
                      potencia: `${estacao.potencia_kw}kW`,
                      tipo: estacao.tipo,
                      status: estacao.conectores_livres > 0 ? 'livre' : 'ocupado',
                      preco: `R$ ${estacao.preco_kwh}/kWh`,
                      rating: 4.8,
                      vagas: estacao.conectores_livres,
                      lat: estacao.latitude,
                      lng: estacao.longitude,
                    }
                  });
                }}>
                <Text style={s.btnRecarregarText}>
                  {estacao.conectores_livres > 0 ? '⚡ Ver Detalhes' : 'Indisponível'}
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
  infoRow:  { flexDirection:'row', gap:12, marginBottom:12 },
  infoItem: { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.6)' },
  cardBtns:          { flexDirection:'row', gap:10 },
  btnNavegar:        { flex:1, height:42, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:12, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  btnNavegarText:    { fontFamily:'Syne-Bold', fontSize:13, color:'#F0F4FF' },
  btnRecarregar:     { flex:1, height:42, backgroundColor:'#00E5FF', borderRadius:12, alignItems:'center', justifyContent:'center' },
  btnRecarregarText: { fontFamily:'Syne-Bold', fontSize:13, color:'#000' },
  btnDisabled:       { backgroundColor:'rgba(255,255,255,0.06)' },
});
