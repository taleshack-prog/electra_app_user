import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, PanResponder,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 48 - 32;
const MIN_KM = 100;
const MAX_KM = 700;

export default function SetupAutonomiaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [autonomia, setAutonomia] = useState(400);
  const [alerta, setAlerta]       = useState(20);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const sliderX   = useRef(new Animated.Value(0)).current;

  // Converte km para posição do slider
  const kmToX = (km: number) =>
    ((km - MIN_KM) / (MAX_KM - MIN_KM)) * SLIDER_WIDTH;

  // Converte posição para km
  const xToKm = (x: number) => {
    const km = Math.round((x / SLIDER_WIDTH) * (MAX_KM - MIN_KM) + MIN_KM);
    return Math.max(MIN_KM, Math.min(MAX_KM, km));
  };

  useEffect(() => {
    sliderX.setValue(kmToX(autonomia));
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderMove: (_, gs) => {
      const newX = Math.max(0, Math.min(SLIDER_WIDTH, kmToX(autonomia) + gs.dx));
      sliderX.setValue(newX);
      setAutonomia(xToKm(newX));
    },
    onPanResponderRelease: (_, gs) => {
      const newX = Math.max(0, Math.min(SLIDER_WIDTH, kmToX(autonomia) + gs.dx));
      const newKm = xToKm(newX);
      setAutonomia(newKm);
      sliderX.setValue(kmToX(newKm));
    },
  });

  const alertaOpcoes = [10, 15, 20, 25, 30];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Autonomia</Text>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* Progress */}
        <Animated.View style={[styles.progressArea, { opacity: fadeAnim }]}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Passo 2 de 2</Text>
            <Text style={styles.progressPct}>100%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressSub}>Usamos para calcular alertas proativos</Text>
        </Animated.View>

        {/* Card autonomia */}
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.cardLabel}>AUTONOMIA EM ROTA</Text>

          {/* Valor grande */}
          <View style={styles.valueRow}>
            <Text style={styles.valueNum}>{autonomia}</Text>
            <Text style={styles.valueUnit}>km</Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderArea}>
            {/* Track */}
            <View style={styles.sliderTrack}>
              <Animated.View style={[
                styles.sliderFill,
                { width: sliderX },
              ]} />
            </View>

            {/* Thumb */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.sliderThumb, { transform: [{ translateX: sliderX }] }]}
            />
          </View>

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelMin}>{MIN_KM} km</Text>
            <Text style={styles.sliderLabelMax}>{MAX_KM} km</Text>
          </View>
        </Animated.View>

        {/* Alerta */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>ALERTAR QUANDO RESTAR</Text>
          <View style={styles.alertaRow}>
            {alertaOpcoes.map(pct => (
              <TouchableOpacity
                key={pct}
                style={[styles.alertaBtn, alerta === pct && styles.alertaBtnActive]}
                onPress={() => setAlerta(pct)}
              >
                <Text style={[styles.alertaBtnText, alerta === pct && styles.alertaBtnTextActive]}>
                  {pct}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Preview */}
        <Animated.View style={[styles.previewBox, { opacity: fadeAnim }]}>
          <View style={styles.previewRow}>
            <Text style={styles.previewIcon}>⚡</Text>
            <View style={styles.previewInfo}>
              <Text style={styles.previewTitle}>Alerta automático</Text>
              <Text style={styles.previewSub}>
                Você será avisado quando restar{' '}
                <Text style={styles.previewHighlight}>
                  {Math.round(autonomia * alerta / 100)} km
                </Text>
                {' '}de autonomia ({alerta}% de {autonomia} km)
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Info box */}
        <Animated.View style={[styles.infoBox, { opacity: fadeAnim }]}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            A IA do ELECTRA Rescue monitora sua bateria em tempo real e ajusta os alertas automaticamente com base no seu perfil de uso.
          </Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.85}
            onPress={() => navigation.replace('MainTabs')}
          >
            <Text style={styles.btnText}>Concluir configuração</Text>
            <Text style={styles.btnArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { fontSize: 18, color: 'rgba(240,244,255,0.6)' },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },

  progressArea:  { marginBottom: 24 },
  progressRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  progressPct:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, color: '#00FF87' },
  progressTrack: { height: 3, backgroundColor: '#1A2236', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill:  { height: 3, borderRadius: 2, backgroundColor: '#00FF87' },
  progressSub:   { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.35)' },

  card:      { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  cardLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 16 },

  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 28 },
  valueNum: { fontFamily: 'Syne-Bold', fontSize: 56, color: '#F0F4FF', letterSpacing: -1 },
  valueUnit:{ fontFamily: 'DMSans-Regular', fontSize: 20, color: 'rgba(240,244,255,0.4)' },

  sliderArea:  { marginBottom: 10, paddingHorizontal: 0, height: 40, justifyContent: 'center' },
  sliderTrack: { height: 5, backgroundColor: '#1A2236', borderRadius: 3, overflow: 'hidden' },
  sliderFill:  { height: 5, backgroundColor: '#00E5FF', borderRadius: 3 },
  sliderThumb: {
    position: 'absolute',
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#00E5FF',
    borderWidth: 3, borderColor: '#070B14',
    top: 9, left: -11,
    shadowColor: '#00E5FF', shadowOpacity: 0.5, shadowRadius: 8, elevation: 6,
  },
  sliderLabels:   { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabelMin: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.25)' },
  sliderLabelMax: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.25)' },

  section:      { marginBottom: 20 },
  sectionLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 12 },

  alertaRow:         { flexDirection: 'row', gap: 8 },
  alertaBtn:         { flex: 1, height: 44, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  alertaBtnActive:   { backgroundColor: 'rgba(255,184,0,0.12)', borderColor: '#FFB800' },
  alertaBtnText:     { fontFamily: 'JetBrainsMono-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)' },
  alertaBtnTextActive:{ color: '#FFB800', fontWeight: '600' },

  previewBox:  { backgroundColor: 'rgba(0,229,255,0.06)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.15)', borderRadius: 14, padding: 14, marginBottom: 16 },
  previewRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  previewIcon: { fontSize: 20 },
  previewInfo: { flex: 1 },
  previewTitle:{ fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF', marginBottom: 4 },
  previewSub:  { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)', lineHeight: 20 },
  previewHighlight: { color: '#00E5FF', fontWeight: '600' },

  infoBox:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 14, marginBottom: 24 },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)', lineHeight: 20 },

  btnPrimary: { height: 54, backgroundColor: '#00E5FF', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#00E5FF', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  btnText:    { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  btnArrow:   { fontFamily: 'Syne-Bold', fontSize: 16, color: '#000' },
});
