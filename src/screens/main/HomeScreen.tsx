import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useStations } from '../../hooks/useStations';
import { useProfile } from '../../hooks/useProfile';
import { ElectraVoice } from '../../components/voice/ElectraVoice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width, height } = Dimensions.get('window');

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
    .leaflet-tile { filter: brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.6); }
    .custom-pin { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 8px; }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  const map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([-23.5558, -46.6396], 14);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  const estacoes = [
    { lat: -23.5614, lng: -46.6560, nome: 'Eletroposto Central', status: 'livre',   kw: '150kW' },
    { lat: -23.5489, lng: -46.6388, nome: 'BYD Charge Hub',      status: 'ocupado', kw: '22kW'  },
    { lat: -23.5700, lng: -46.6470, nome: 'EV Station Plus',      status: 'livre',   kw: '50kW'  },
  ];

  estacoes.forEach(e => {
    const cor = e.status === 'livre' ? '#00FF87' : '#FFB800';
    const icon = L.divIcon({
      className: '',
      html: '<div style="width:12px;height:12px;border-radius:50%;border:1.5px solid ' + cor + ';background:' + cor + '44;"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([e.lat, e.lng], { icon })
      .addTo(map)
      
  });

  // Pin do usuário
  const userIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#00E5FF;border:3px solid #070B14;box-shadow:0 0 12px #00E5FF88;"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  L.marker([-23.5558, -46.6396], { icon: userIcon }).addTo(map);
</script>
</body>
</html>
`;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile } = useProfile();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const sosPulse  = useRef(new Animated.Value(1)).current;

  const bateria   = 42;
  const autonomia = 168;
  const veiculo   = 'BYD Seal 03';
  const bateriaColor = bateria <= 20 ? '#FF3B5C' : bateria <= 40 ? '#FFB800' : '#00E5FF';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sosPulse, { toValue: 1.06, duration: 1000, useNativeDriver: true }),
        Animated.timing(sosPulse, { toValue: 1,    duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* MAPA LEAFLET */}
      <View style={styles.mapArea}>
        <WebView
          source={{ html: MAPA_HTML }}
          style={styles.map}
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          originWhitelist={['*']}
        />

        {/* Header flutuante */}
        <Animated.View style={[styles.floatHeader, { opacity: fadeAnim }]}>
          <View style={styles.greetCard}>
            <Text style={styles.greetSub}>Olá,</Text>
            <Text style={styles.greetName}>{profile?.nome?.split(' ')[0] || 'Usuário'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </Animated.View>

        {/* Legenda */}
        <View style={styles.mapLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#00FF87' }]} />
            <Text style={styles.legendText}>Livre</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFB800' }]} />
            <Text style={styles.legendText}>Ocupado</Text>
          </View>
        </View>

        <View style={styles.mapGradient} />
      </View>

      {/* CARDS */}
      <ScrollView
        style={styles.cardsArea}
        contentContainerStyle={styles.cardsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bateria */}
        <Animated.View style={[styles.batteryCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.batteryTop}>
            <View>
              <Text style={styles.batteryLabel}>{veiculo}</Text>
              <View style={styles.batteryValueRow}>
                <Text style={[styles.batteryNum, { color: bateriaColor }]}>{bateria}</Text>
                <Text style={styles.batteryPct}>%</Text>
              </View>
              <Text style={styles.batteryAuto}>
                Autonomia · <Text style={{ color: bateriaColor }}>{autonomia} km</Text>
              </Text>
            </View>
            <View style={styles.batteryRight}>
              <View style={[styles.batIconOuter, { borderColor: bateriaColor }]}>
                <View style={[styles.batIconFill, { width: `${bateria}%` as any, backgroundColor: bateriaColor }]} />
              </View>
              <Text style={[styles.batteryStatus, { color: bateriaColor }]}>
                {bateria <= 20 ? '⚠ Crítico' : bateria <= 40 ? '⚡ Baixo' : '✓ OK'}
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${bateria}%` as any, backgroundColor: bateriaColor }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0%</Text>
            <Text style={[styles.progressLabel, { color: bateriaColor }]}>{bateria}%</Text>
            <Text style={styles.progressLabel}>100%</Text>
          </View>
        </Animated.View>

        {/* IA Card */}
        <Animated.View style={[styles.iaCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.iaHeader}>
            <View style={styles.iaIconWrap}>
              <Text style={styles.iaIcon}>🤖</Text>
            </View>
            <View style={styles.iaInfo}>
              <View style={styles.iaLabelRow}>
                <Text style={styles.iaLabel}>IA RESCUE</Text>
                <View style={styles.iaBadge}>
                  <Text style={styles.iaBadgeText}>ATIVO</Text>
                </View>
              </View>
              <Text style={styles.iaText}>
                Com {bateria}% de bateria, você tem ~{autonomia}km. Posto a{' '}
                <Text style={styles.iaCyan}>2,3km</Text>
              </Text>
            </View>
          </View>
          <View style={styles.iaBtns}>
            <TouchableOpacity style={styles.iaBtnPrimary}>
              <Text style={styles.iaBtnPrimaryText}>Ver posto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iaBtnSecondary}>
              <Text style={styles.iaBtnSecondaryText}>Ignorar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* SOS */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ConfirmarSocorro')}
          >
            <Animated.View style={[styles.sosCard, { transform: [{ scale: sosPulse }] }]}>
              <View style={styles.sosLeft}>
                <View style={styles.sosIconWrap}>
                  <Text style={styles.sosIconText}>🆘</Text>
                </View>
                <View>
                  <Text style={styles.sosTitle}>Precisa de socorro?</Text>
                  <Text style={styles.sosSub}>Resgatista em ~8 min</Text>
                </View>
              </View>
              <View style={styles.sosBtnRight}>
                <Text style={styles.sosBtnText}>SOS</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* IA de Voz ELECTRA */}
      <View style={styles.voiceWrap}>
        <ElectraVoice />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#070B14' },
  mapArea:  { height: height * 0.48, position: 'relative' },
  map:      { flex: 1, backgroundColor: '#0A1628' },

  floatHeader: { position: 'absolute', top: 48, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greetCard:   { backgroundColor: 'rgba(13,19,32,0.92)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  greetSub:    { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)' },
  greetName:   { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },
  notifBtn:    { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(13,19,32,0.92)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  notifIcon:   { fontSize: 18 },
  notifDot:    { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B5C', borderWidth: 1.5, borderColor: '#070B14' },

  mapLegend:  { position: 'absolute', bottom: 60, right: 14, gap: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(13,19,32,0.85)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  legendDot:  { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.6)' },
  mapGradient:{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(7,11,20,0.8)' },

  cardsArea:    { flex: 1, marginTop: -20 },
  cardsContent: { paddingHorizontal: 16, paddingTop: 8 },

  batteryCard:     { backgroundColor: 'rgba(13,19,32,0.97)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 22, padding: 18, marginBottom: 10 },
  batteryTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  batteryLabel:    { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 1, marginBottom: 4 },
  batteryValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  batteryNum:      { fontFamily: 'Syne-Bold', fontSize: 52, letterSpacing: -1 },
  batteryPct:      { fontFamily: 'DMSans-Regular', fontSize: 18, color: 'rgba(240,244,255,0.4)' },
  batteryAuto:     { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)', marginTop: 4 },
  batteryRight:    { alignItems: 'center', gap: 8, paddingTop: 4 },
  batIconOuter:    { width: 54, height: 26, borderWidth: 1.5, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 2, overflow: 'hidden' },
  batIconFill:     { height: '100%', borderRadius: 2 },
  batteryStatus:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 0.5 },
  progressTrack:   { height: 5, backgroundColor: '#1A2236', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill:    { height: 5, borderRadius: 3 },
  progressLabels:  { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 9, color: 'rgba(240,244,255,0.2)' },

  iaCard:      { backgroundColor: 'rgba(0,229,255,0.06)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.18)', borderRadius: 20, padding: 16, marginBottom: 10 },
  iaHeader:    { flexDirection: 'row', gap: 10, marginBottom: 12 },
  iaIconWrap:  { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  iaIcon:      { fontSize: 18 },
  iaInfo:      { flex: 1 },
  iaLabelRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  iaLabel:     { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: '#00E5FF', letterSpacing: 1 },
  iaBadge:     { backgroundColor: 'rgba(0,229,255,0.15)', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  iaBadgeText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 9, color: '#00E5FF' },
  iaText:      { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.7)', lineHeight: 20 },
  iaCyan:      { color: '#00E5FF', fontWeight: '600' },
  iaBtns:      { flexDirection: 'row', gap: 8 },
  iaBtnPrimary:      { height: 34, paddingHorizontal: 16, backgroundColor: '#00E5FF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iaBtnPrimaryText:  { fontFamily: 'Syne-Bold', fontSize: 13, color: '#000' },
  iaBtnSecondary:    { height: 34, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iaBtnSecondaryText:{ fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)' },

  sosCard:     { backgroundColor: 'rgba(255,59,92,0.08)', borderWidth: 1, borderColor: 'rgba(255,59,92,0.25)', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sosLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  sosIconWrap: { width: 44, height: 44, borderRadius: 13, backgroundColor: 'rgba(255,59,92,0.15)', alignItems: 'center', justifyContent: 'center' },
  sosIconText: { fontSize: 22 },
  sosTitle:    { fontFamily: 'Syne-Bold', fontSize: 15, color: '#F0F4FF', marginBottom: 2 },
  sosSub:      { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  sosBtnRight: { width: 64, height: 44, backgroundColor: '#FF3B5C', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF3B5C', shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  sosBtnText:  { fontFamily: 'Syne-Bold', fontSize: 16, color: '#fff', letterSpacing: 1 },
  voiceWrap:   { position: 'absolute', bottom: 90, right: 16, zIndex: 999 },
});
