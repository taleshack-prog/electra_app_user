import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions, ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const FILTROS = ['Todos', 'DC Fast', 'AC', 'Disponível', '24h'];

const ESTACOES = [
  { id: '1', nome: 'Eletroposto Central', end: 'Av. Paulista, 1000', dist: '1,2km', potencia: '150kW', tipo: 'DC', status: 'livre',   preco: 'R$ 3,20/kWh', rating: 4.8, vagas: 3 },
  { id: '2', nome: 'BYD Charge Hub',      end: 'R. Augusta, 400',   dist: '2,7km', potencia: '22kW',  tipo: 'AC', status: 'ocupado', preco: 'R$ 2,10/kWh', rating: 4.5, vagas: 0 },
  { id: '3', nome: 'EV Station Plus',     end: 'Av. Faria Lima, 200',dist: '3,1km', potencia: '50kW',  tipo: 'DC', status: 'livre',   preco: 'R$ 2,80/kWh', rating: 4.9, vagas: 2 },
  { id: '4', nome: 'GreenCharge 24h',     end: 'R. Oscar Freire, 50',dist: '4,2km', potencia: '75kW',  tipo: 'DC', status: 'livre',   preco: 'R$ 3,00/kWh', rating: 4.7, vagas: 5 },
];

const MAPA_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #0A1628; }
    .leaflet-tile { filter: brightness(0.8) saturate(0.6) hue-rotate(180deg) invert(1) brightness(0.55); }
    .leaflet-control-attribution, .leaflet-control-zoom { display: none; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  const map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([-23.5558, -46.6396], 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  const estacoes = [
    { lat: -23.5614, lng: -46.6560, nome: 'Eletroposto Central', status: 'livre',   kw: '150kW' },
    { lat: -23.5489, lng: -46.6388, nome: 'BYD Charge Hub',      status: 'ocupado', kw: '22kW'  },
    { lat: -23.5700, lng: -46.6470, nome: 'EV Station Plus',     status: 'livre',   kw: '50kW'  },
    { lat: -23.5420, lng: -46.6520, nome: 'GreenCharge 24h',     status: 'livre',   kw: '75kW'  },
  ];

  estacoes.forEach(e => {
    const cor = e.status === 'livre' ? '#00FF87' : '#FFB800';
    const icon = L.divIcon({
      className: '',
      html: '<div style="width:36px;height:36px;border-radius:50%;border:2px solid ' + cor + ';background:' + cor + '22;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 12px ' + cor + '44;">⚡</div>',
      iconSize: [36,36], iconAnchor: [18,18],
    });
    L.marker([e.lat, e.lng], { icon })
      .addTo(map)
      .bindPopup('<b>' + e.nome + '</b><br>' + e.kw + ' · ' + e.status);
  });

  // Pin usuário
  const userIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#00E5FF;border:3px solid #070B14;box-shadow:0 0 16px #00E5FF88;"></div>',
    iconSize: [16,16], iconAnchor: [8,8],
  });
  L.marker([-23.5558, -46.6396], { icon: userIcon }).addTo(map);
</script>
</body>
</html>
`;

export default function MapaScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const estacoesFiltradas = ESTACOES.filter(e => {
    if (filtroAtivo === 'Todos') return true;
    if (filtroAtivo === 'DC Fast') return e.tipo === 'DC';
    if (filtroAtivo === 'AC') return e.tipo === 'AC';
    if (filtroAtivo === 'Disponível') return e.status === 'livre';
    if (filtroAtivo === '24h') return e.nome.includes('24h');
    return true;
  });

  const estacaoDetalhe = ESTACOES.find(e => e.id === estacaoSelecionada);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Mapa full screen */}
      <WebView
        source={{ html: MAPA_HTML }}
        style={StyleSheet.absoluteFillObject}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        originWhitelist={['*']}
        scrollEnabled={false}
      />

      {/* Header flutuante */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Estações</Text>
          <Text style={styles.headerSub}>{estacoesFiltradas.length} encontradas</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>⚙</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Filtros */}
      <Animated.View style={[styles.filtrosWrap, { opacity: fadeAnim }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtrosScroll}>
          {FILTROS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filtroChip, filtroAtivo === f && styles.filtroChipActive]}
              onPress={() => setFiltroAtivo(f)}
            >
              <Text style={[styles.filtroText, filtroAtivo === f && styles.filtroTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Lista de estações */}
      <Animated.View style={[styles.listaWrap, { opacity: fadeAnim }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaScroll}
          snapToInterval={width * 0.8 + 12}
          decelerationRate="fast"
        >
          {estacoesFiltradas.map(e => (
            <TouchableOpacity
              key={e.id}
              style={[styles.estacaoCard, estacaoSelecionada === e.id && styles.estacaoCardActive]}
              onPress={() => setEstacaoSelecionada(e.id === estacaoSelecionada ? null : e.id)}
              activeOpacity={0.85}
            >
              {/* Top */}
              <View style={styles.estacaoTop}>
                <View style={[styles.statusPill, { backgroundColor: e.status === 'livre' ? 'rgba(0,255,135,0.15)' : 'rgba(255,184,0,0.15)' }]}>
                  <View style={[styles.statusDot, { backgroundColor: e.status === 'livre' ? '#00FF87' : '#FFB800' }]} />
                  <Text style={[styles.statusText, { color: e.status === 'livre' ? '#00FF87' : '#FFB800' }]}>
                    {e.status === 'livre' ? 'Disponível' : 'Ocupado'}
                  </Text>
                </View>
                <Text style={styles.estacaoRating}>⭐ {e.rating}</Text>
              </View>

              {/* Nome */}
              <Text style={styles.estacaoNome}>{e.nome}</Text>
              <Text style={styles.estacaoEnd}>{e.end}</Text>

              {/* Specs */}
              <View style={styles.specsRow}>
                <View style={styles.specItem}>
                  <Text style={styles.specIcon}>⚡</Text>
                  <Text style={styles.specVal}>{e.potencia}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specIcon}>📍</Text>
                  <Text style={styles.specVal}>{e.dist}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specIcon}>💰</Text>
                  <Text style={styles.specVal}>{e.preco}</Text>
                </View>
              </View>

              {/* Vagas */}
              {e.status === 'livre' && (
                <View style={styles.vagasRow}>
                  <Text style={styles.vagasText}>🔌 {e.vagas} vagas livres</Text>
                </View>
              )}

              {/* CTA */}
              <View style={styles.estacaoBtns}>
                <TouchableOpacity style={styles.btnNavegar}>
                  <Text style={styles.btnNavegarText}>🗺 Navegar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnRecarregar, e.status === 'ocupado' && styles.btnDisabled]}>
                  <Text style={styles.btnRecarregarText}>
                    {e.status === 'livre' ? '⚡ Recarregar' : 'Indisponível'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Botão minha localização */}
      <Animated.View style={[styles.myLocBtn, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.myLocBtnInner}>
          <Text style={styles.myLocIcon}>◎</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1628' },

  header:     { position: 'absolute', top: 48, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerCard: { flex: 1, backgroundColor: 'rgba(13,19,32,0.92)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  headerTitle:{ fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },
  headerSub:  { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 1 },
  filterBtn:  { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(13,19,32,0.92)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  filterIcon: { fontSize: 18 },

  filtrosWrap:   { position: 'absolute', top: 118, left: 0, right: 0 },
  filtrosScroll: { paddingHorizontal: 16, gap: 8 },
  filtroChip:    { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: 'rgba(13,19,32,0.9)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  filtroChipActive: { backgroundColor: 'rgba(0,229,255,0.15)', borderColor: '#00E5FF' },
  filtroText:    { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)' },
  filtroTextActive: { color: '#00E5FF', fontWeight: '600' },

  listaWrap:   { position: 'absolute', bottom: 90, left: 0, right: 0 },
  listaScroll: { paddingHorizontal: 16, gap: 12 },

  estacaoCard:       { width: width * 0.8, backgroundColor: 'rgba(13,19,32,0.96)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16 },
  estacaoCardActive: { borderColor: 'rgba(0,229,255,0.3)' },
  estacaoTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusPill:        { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusDot:         { width: 6, height: 6, borderRadius: 3 },
  statusText:        { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, fontWeight: '600' },
  estacaoRating:     { fontFamily: 'DMSans-Regular', fontSize: 13, color: '#FFB800' },
  estacaoNome:       { fontFamily: 'Syne-Bold', fontSize: 15, color: '#F0F4FF', marginBottom: 3 },
  estacaoEnd:        { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginBottom: 12 },

  specsRow:  { flexDirection: 'row', gap: 12, marginBottom: 8 },
  specItem:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specIcon:  { fontSize: 12 },
  specVal:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: 'rgba(240,244,255,0.6)' },

  vagasRow:  { marginBottom: 10 },
  vagasText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: '#00FF87' },

  estacaoBtns:      { flexDirection: 'row', gap: 8, marginTop: 4 },
  btnNavegar:        { flex: 1, height: 38, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnNavegarText:    { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.7)' },
  btnRecarregar:     { flex: 1, height: 38, backgroundColor: '#00E5FF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnRecarregarText: { fontFamily: 'Syne-Bold', fontSize: 13, color: '#000' },
  btnDisabled:       { backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },

  myLocBtn:      { position: 'absolute', right: 16, bottom: 220 },
  myLocBtnInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(13,19,32,0.92)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  myLocIcon:     { fontSize: 20, color: '#00E5FF' },
});
