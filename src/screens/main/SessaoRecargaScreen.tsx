import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions, Alert, Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');

export default function SessaoRecargaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const progressAnim= useRef(new Animated.Value(0.12)).current;

  const [segundos,     setSegundos]     = useState(0);
  const [bateria,      setBateria]      = useState(12);
  const [kwh,          setKwh]          = useState(0);
  const [custo,        setCusto]        = useState(0);
  const [potencia,     setPotencia]     = useState(148);
  const [ativa,        setAtiva]        = useState(true);
  const META_BATERIA = 80;
  const PRECO_KWH    = 3.20;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // Pulso do ícone
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Ticker da sessão
    const interval = setInterval(() => {
      if (!ativa) return;
      setSegundos(s => s + 1);
      setKwh(k => parseFloat((k + 0.035).toFixed(3)));
      setBateria(b => {
        const nova = Math.min(b + 0.05, META_BATERIA);
        Animated.timing(progressAnim, {
          toValue: nova / 100,
          duration: 400,
          useNativeDriver: false,
        }).start();
        return nova;
      });
      setCusto(c => parseFloat((c + 0.035 * PRECO_KWH).toFixed(2)));
      setPotencia(p => Math.round(Math.max(100, Math.min(150, p + (Math.random() - 0.5) * 4))));
    }, 1000);

    return () => clearInterval(interval);
  }, [ativa]);

  const formatTempo = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(seg).padStart(2,'0')}`;
  };

  const minsRestantes = () => {
    const pctLeft = META_BATERIA - bateria;
    const kwLeft  = (pctLeft / 100) * 75;
    return Math.ceil((kwLeft / potencia) * 60);
  };

  const bateriaColor = bateria <= 20 ? '#FF3B5C' : bateria <= 40 ? '#FFB800' : '#00E5FF';

  const handleParar = () => {
    Alert.alert(
      'Parar Recarga?',
      `Bateria em ${Math.round(bateria)}%. Deseja encerrar a sessão?`,
      [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Parar',
          style: 'destructive',
          onPress: () => {
            setAtiva(false);
            navigation.navigate('CheckoutRecarga');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SESSÃO ATIVA</Text>
        </View>
        <Text style={styles.estacaoNome}>Eletroposto Central</Text>
        <Text style={styles.conectorInfo}>CCS2 · DC Rápido · 150kW · R$ 3,20/kWh</Text>
      </Animated.View>

      {/* Bateria central */}
      <Animated.View style={[styles.bateriaArea, { opacity: fadeAnim }]}>
        <Animated.Text style={[styles.raioIcon, { transform: [{ scale: pulseAnim }] }]}>⚡</Animated.Text>
        <View style={styles.bateriaNumRow}>
          <Text style={[styles.bateriaNum, { color: bateriaColor }]}>{Math.round(bateria)}</Text>
          <Text style={styles.bateriaPct}>%</Text>
        </View>
        <Text style={styles.bateriaLabel}>Nível de bateria atual</Text>

        {/* Barra progresso */}
        <View style={styles.progressTrack}>
          <Animated.View style={[
            styles.progressFill,
            {
              backgroundColor: bateriaColor,
              width: progressAnim.interpolate({ inputRange: [0,1], outputRange: ['0%', '100%'] }),
            },
          ]} />
        </View>
        <View style={styles.progressLegend}>
          <Text style={styles.progressStart}>Início: 12%</Text>
          <Text style={[styles.progressMeta, { color: '#00FF87' }]}>Meta: {META_BATERIA}% ✓</Text>
        </View>

        {/* Tempo restante */}
        <View style={styles.etaBox}>
          <Text style={styles.etaText}>⏳ ~{minsRestantes()} min para {META_BATERIA}%</Text>
        </View>
      </Animated.View>

      {/* Métricas */}
      <Animated.View style={[styles.metricsGrid, { opacity: fadeAnim }]}>
        {[
          { emoji: '⚡', val: `${kwh.toFixed(1)} kWh`, label: 'Energia entregue' },
          { emoji: '⏱',  val: formatTempo(segundos),   label: 'Tempo de sessão' },
          { emoji: '🔋', val: `+${Math.round(bateria - 12)}%`, label: 'Ganho de bateria' },
          { emoji: '📡', val: `${potencia} kW`,         label: 'Potência atual' },
        ].map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <Text style={styles.metricEmoji}>{m.emoji}</Text>
            <Text style={styles.metricVal}>{m.val}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Live power */}
      <Animated.View style={[styles.liveRow, { opacity: fadeAnim }]}>
        <Text style={styles.liveIcon}>📡</Text>
        <Text style={styles.liveTxt}>Potência atual:</Text>
        <Text style={styles.liveVal}>{potencia} kW</Text>
        <View style={styles.liveBadge}><Text style={styles.liveBadgeTxt}>AO VIVO</Text></View>
      </Animated.View>

      {/* Bottom */}
      <Animated.View style={[styles.bottom, { opacity: fadeAnim }]}>
        <View style={styles.custoRow}>
          <Text style={styles.custoLabel}>Custo acumulado</Text>
          <Text style={styles.custoVal}>R$ {custo.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.btnParar} onPress={handleParar} activeOpacity={0.85}>
          <Text style={styles.btnPararText}>⏹ Parar Recarga</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070B14' },

  header:       { alignItems: 'center', paddingTop: 20, paddingBottom: 16, paddingHorizontal: 20 },
  statusRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  statusDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF87' },
  statusText:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#00FF87', letterSpacing: 2 },
  estacaoNome:  { fontFamily: 'Syne-Bold', fontSize: 18, color: '#F0F4FF', marginBottom: 4 },
  conectorInfo: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },

  bateriaArea:   { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 20 },
  raioIcon:      { fontSize: 52, marginBottom: 8 },
  bateriaNumRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bateriaNum:    { fontFamily: 'Syne-Bold', fontSize: 72, letterSpacing: -2, lineHeight: 76 },
  bateriaPct:    { fontFamily: 'DMSans-Regular', fontSize: 28, color: 'rgba(240,244,255,0.4)', paddingBottom: 8 },
  bateriaLabel:  { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)', marginTop: 4, marginBottom: 16 },

  progressTrack:  { width: '100%', height: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden', marginBottom: 6 },
  progressFill:   { height: 10, borderRadius: 5 },
  progressLegend: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  progressStart:  { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.3)' },
  progressMeta:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 10 },

  etaBox:  { backgroundColor: 'rgba(0,229,255,0.08)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  etaText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: '#00E5FF' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  metricCard:  { flex: 1, minWidth: '46%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  metricEmoji: { fontSize: 20, marginBottom: 4 },
  metricVal:   { fontFamily: 'Syne-Bold', fontSize: 18, color: '#F0F4FF', marginBottom: 2 },
  metricLabel: { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)' },

  liveRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  liveIcon:     { fontSize: 16 },
  liveTxt:      { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)', flex: 1 },
  liveVal:      { fontFamily: 'Syne-Bold', fontSize: 15, color: '#FFB800' },
  liveBadge:    { backgroundColor: 'rgba(0,255,135,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  liveBadgeTxt: { fontFamily: 'JetBrainsMono-Regular', fontSize: 9, color: '#00FF87' },

  bottom:     { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 24, backgroundColor: '#070B14', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  custoRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  custoLabel: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)' },
  custoVal:   { fontFamily: 'Syne-Bold', fontSize: 26, color: '#F0F4FF' },
  btnParar:   { height: 54, backgroundColor: '#FF3B5C', borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF3B5C', shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  btnPararText:{ fontFamily: 'Syne-Bold', fontSize: 16, color: '#fff', letterSpacing: 0.5 },
});
