import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions, Easing,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width, height } = Dimensions.get('window');

const MAPA_TRACKING_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #0A1628; }
    .leaflet-tile { filter: brightness(0.7) saturate(0.5) hue-rotate(180deg) invert(1) brightness(0.5); }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  const map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([-23.5558, -46.6396], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  // Pin usuário
  const userIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#FF3B5C;border:3px solid #070B14;box-shadow:0 0 16px #FF3B5C88;"></div>',
    iconSize: [16,16], iconAnchor: [8,8],
  });
  const userMarker = L.marker([-23.5558, -46.6396], { icon: userIcon }).addTo(map);

  // Pin resgatista
  const rescueIcon = L.divIcon({
    className: '',
    html: '<div style="background:#111827;border:2px solid #00E5FF;border-radius:8px;padding:4px 6px;font-size:18px;white-space:nowrap;">🚐</div>',
    iconSize: [40,34], iconAnchor: [20,17],
  });
  let rescueLat = -23.5489;
  let rescueLng = -46.6388;
  const rescueMarker = L.marker([rescueLat, rescueLng], { icon: rescueIcon }).addTo(map);

  // Rota tracejada
  const rota = L.polyline([
    [-23.5489, -46.6388],
    [-23.5520, -46.6392],
    [-23.5558, -46.6396],
  ], { color: '#00E5FF', weight: 2.5, dashArray: '8, 6', opacity: 0.6 }).addTo(map);

  // Anima o resgatista se aproximando
  let step = 0;
  const steps = [
    [-23.5489, -46.6388],
    [-23.5505, -46.6390],
    [-23.5520, -46.6392],
    [-23.5535, -46.6393],
    [-23.5545, -46.6394],
    [-23.5558, -46.6396],
  ];
  setInterval(() => {
    if (step < steps.length - 1) {
      step++;
      rescueMarker.setLatLng(steps[step]);
    }
  }, 4000);

  map.fitBounds([[-23.5489, -46.6388], [-23.5558, -46.6396]], { padding: [40, 40] });
</script>
</body>
</html>
`;

export default function TrackingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const dotAnim    = useRef(new Animated.Value(0)).current;
  const etaAnim    = useRef(new Animated.Value(8)).current;

  const [eta, setEta]       = useState(8);
  const [distancia, setDistancia] = useState('2,3');
  const [status, setStatus] = useState('A caminho');

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // Pulso do dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Simula redução do ETA
    const interval = setInterval(() => {
      setEta(e => {
        if (e <= 1) {
          clearInterval(interval);
          setStatus('Chegando!');
          setDistancia('0,1');
          return 1;
        }
        setDistancia(d => {
          const num = parseFloat(d.replace(',', '.')) - 0.3;
          return Math.max(0.1, num).toFixed(1).replace('.', ',');
        });
        return e - 1;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const dotOpacity = dotAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Mapa */}
      <View style={styles.mapArea}>
        <WebView
          source={{ html: MAPA_TRACKING_HTML }}
          style={StyleSheet.absoluteFillObject}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          originWhitelist={['*']}
          scrollEnabled={false}
        />

        {/* Header flutuante */}
        <Animated.View style={[styles.floatHeader, { opacity: fadeAnim }]}>
          <View style={styles.statusCard}>
            <Animated.View style={[styles.statusDot, { opacity: dotOpacity }]} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </Animated.View>

        <View style={styles.mapGradient} />
      </View>

      {/* Painel inferior */}
      <Animated.View style={[styles.painel, { opacity: fadeAnim }]}>

        {/* Resgatista info */}
        <View style={styles.resgatistCard}>
          <View style={styles.resgatistAvatar}>
            <Text style={styles.resgatistAvatarText}>JC</Text>
          </View>
          <View style={styles.resgatistInfo}>
            <Text style={styles.resgatistNome}>João Costa</Text>
            <View style={styles.resgatistMeta}>
              <Text style={styles.resgatistRating}>⭐ 4.9</Text>
              <Text style={styles.resgatistSep}>·</Text>
              <Text style={styles.resgatistAtend}>247 atendimentos</Text>
            </View>
            <Text style={styles.resgatistVeiculo}>🚐 Van ELECTRA · ABC-1234</Text>
          </View>
          <TouchableOpacity style={styles.ligarBtn}>
            <Text style={styles.ligarIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* ETA */}
        <View style={styles.etaRow}>
          <View style={styles.etaCard}>
            <Text style={styles.etaNum}>{eta}</Text>
            <Text style={styles.etaUnit}>min</Text>
            <Text style={styles.etaLabel}>Chegada estimada</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaCard}>
            <Text style={styles.etaNum}>{distancia}</Text>
            <Text style={styles.etaUnit}>km</Text>
            <Text style={styles.etaLabel}>Distância</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaCard}>
            <Text style={styles.etaNum}>R$</Text>
            <Text style={styles.etaUnit}>85</Text>
            <Text style={styles.etaLabel}>Estimado</Text>
          </View>
        </View>

        {/* Chat rápido */}
        <View style={styles.chatRow}>
          {['Estou no acostamento', 'Pisca alerta ligado', 'Aguardando você'].map(msg => (
            <TouchableOpacity key={msg} style={styles.chatChip}>
              <Text style={styles.chatChipText}>{msg}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cancelar */}
        <TouchableOpacity
          style={styles.btnCancelar}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.btnCancelarText}>Cancelar socorro</Text>
        </TouchableOpacity>

        {/* Simular conclusão */}
        <TouchableOpacity
          style={styles.btnConcluir}
          onPress={() => navigation.navigate('Concluido')}
        >
          <Text style={styles.btnConcluirText}>✅ Simular chegada</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#070B14' },
  mapArea:  { height: height * 0.50, position: 'relative' },

  floatHeader: { position: 'absolute', top: 16, left: 16, right: 16, alignItems: 'center' },
  statusCard:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(13,19,32,0.92)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  statusDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00E5FF' },
  statusText:  { fontFamily: 'Syne-Bold', fontSize: 14, color: '#00E5FF' },
  mapGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(7,11,20,0.9)' },

  painel: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  resgatistCard:   { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 14, marginBottom: 12 },
  resgatistAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 1.5, borderColor: '#00E5FF', alignItems: 'center', justifyContent: 'center' },
  resgatistAvatarText: { fontFamily: 'Syne-Bold', fontSize: 16, color: '#00E5FF' },
  resgatistInfo:   { flex: 1 },
  resgatistNome:   { fontFamily: 'Syne-Bold', fontSize: 15, color: '#F0F4FF' },
  resgatistMeta:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  resgatistRating: { fontFamily: 'DMSans-Regular', fontSize: 12, color: '#FFB800' },
  resgatistSep:    { color: 'rgba(240,244,255,0.2)' },
  resgatistAtend:  { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  resgatistVeiculo:{ fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  ligarBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,255,135,0.1)', borderWidth: 1, borderColor: 'rgba(0,255,135,0.3)', alignItems: 'center', justifyContent: 'center' },
  ligarIcon:       { fontSize: 18 },

  etaRow:    { flexDirection: 'row', backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 14, marginBottom: 12, alignItems: 'center' },
  etaCard:   { flex: 1, alignItems: 'center' },
  etaNum:    { fontFamily: 'Syne-Bold', fontSize: 24, color: '#F0F4FF' },
  etaUnit:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)' },
  etaLabel:  { fontFamily: 'DMSans-Regular', fontSize: 10, color: 'rgba(240,244,255,0.3)', marginTop: 2, textAlign: 'center' },
  etaDivider:{ width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.06)' },

  chatRow:     { flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  chatChip:    { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 20 },
  chatChipText:{ fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.6)' },

  btnCancelar:     { height: 44, borderWidth: 1, borderColor: 'rgba(255,59,92,0.3)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  btnCancelarText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#FF3B5C' },
  btnConcluir:     { height: 44, backgroundColor: 'rgba(0,255,135,0.1)', borderWidth: 1, borderColor: 'rgba(0,255,135,0.3)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnConcluirText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#00FF87' },
});
