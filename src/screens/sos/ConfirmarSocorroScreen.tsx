import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');

const PROBLEMAS = [
  { id: '1', icon: '🔋', label: 'Bateria descarregada' },
  { id: '2', icon: '🔌', label: 'Problema no carregador' },
  { id: '3', icon: '🚗', label: 'Veículo não liga' },
  { id: '4', icon: '⚡', label: 'Falha elétrica' },
  { id: '5', icon: '🛞', label: 'Pneu furado' },
  { id: '6', icon: '❓', label: 'Outro problema' },
];

export default function ConfirmarSocorroScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [problemaSelecionado, setProblemaSelecionado] = useState('1');
  const [localizacao] = useState('Av. Paulista, 1000 — Bela Vista, São Paulo');
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleConfirmar = () => {
    if (confirmando) return;
    setConfirmando(true);
    setTimeout(() => {
      setConfirmando(false);
      navigation.navigate('Tracking');
    }, 1500);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirmar Socorro</Text>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* Status */}
        <Animated.View style={[styles.statusCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Resgatista disponível a <Text style={styles.statusHighlight}>2,3 km</Text></Text>
        </Animated.View>

        {/* Localização */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>SUA LOCALIZAÇÃO</Text>
          <View style={styles.locCard}>
            <View style={styles.locIconWrap}>
              <Text style={styles.locIcon}>📍</Text>
            </View>
            <View style={styles.locInfo}>
              <Text style={styles.locText}>{localizacao}</Text>
              <TouchableOpacity>
                <Text style={styles.locEdit}>Corrigir endereço</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mini mapa simulado */}
          <View style={styles.miniMapa}>
            <View style={styles.miniMapaBg} />
            {/* Grid */}
            {[0,1,2,3,4].map(i => (
              <View key={i} style={[styles.miniMapaLine, { left: i * (width - 32) / 4 }]} />
            ))}
            {[0,1,2].map(i => (
              <View key={i} style={[styles.miniMapaLineH, { top: i * 60 }]} />
            ))}
            {/* Pin usuário */}
            <View style={styles.miniMapaPin}>
              <View style={styles.miniMapaPinDot} />
              <View style={styles.miniMapaPinRing} />
            </View>
            {/* Pin resgatista */}
            <View style={[styles.miniMapaResgatista, { top: 30, left: width * 0.55 }]}>
              <Text style={styles.miniMapaResgatistIcon}>🚐</Text>
            </View>
            {/* Linha tracejada */}
            <View style={styles.miniMapaRota} />
          </View>
        </Animated.View>

        {/* Tipo de problema */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>TIPO DE PROBLEMA</Text>
          <View style={styles.problemasGrid}>
            {PROBLEMAS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.problemaCard,
                  problemaSelecionado === p.id && styles.problemaCardActive,
                ]}
                onPress={() => setProblemaSelecionado(p.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.problemaIcon}>{p.icon}</Text>
                <Text style={[
                  styles.problemaLabel,
                  problemaSelecionado === p.id && styles.problemaLabelActive,
                ]}>
                  {p.label}
                </Text>
                {problemaSelecionado === p.id && (
                  <View style={styles.problemaCheck}>
                    <Text style={styles.problemaCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Resumo */}
        <Animated.View style={[styles.resumoCard, { opacity: fadeAnim }]}>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Problema</Text>
            <Text style={styles.resumoValue}>
              {PROBLEMAS.find(p => p.id === problemaSelecionado)?.label}
            </Text>
          </View>
          <View style={styles.resumoDivider} />
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Tempo estimado</Text>
            <Text style={[styles.resumoValue, { color: '#00FF87' }]}>~8 minutos</Text>
          </View>
          <View style={styles.resumoDivider} />
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Custo estimado</Text>
            <Text style={[styles.resumoValue, { color: '#00E5FF' }]}>R$ 85,00</Text>
          </View>
        </Animated.View>

        {/* Botões */}
        <Animated.View style={[styles.btns, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={[styles.btnConfirmar, confirmando && styles.btnConfirmando]}
            onPress={handleConfirmar}
            activeOpacity={0.85}
            disabled={confirmando}
          >
            {confirmando
              ? <Text style={styles.btnConfirmarText}>Enviando...</Text>
              : <>
                  <Text style={styles.btnConfirmarText}>✅ Confirmar Socorro</Text>
                </>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnCancelar}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  scroll: { flexGrow: 1, paddingHorizontal: 16 },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 16 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { fontSize: 18, color: 'rgba(240,244,255,0.6)' },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },

  statusCard:      { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,255,135,0.08)', borderWidth: 1, borderColor: 'rgba(0,255,135,0.2)', borderRadius: 12, padding: 12, marginBottom: 20 },
  statusDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF87' },
  statusText:      { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.7)' },
  statusHighlight: { color: '#00FF87', fontWeight: '600' },

  section:      { marginBottom: 20 },
  sectionLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 10 },

  locCard:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, marginBottom: 10 },
  locIconWrap:{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,59,92,0.1)', alignItems: 'center', justifyContent: 'center' },
  locIcon:    { fontSize: 18 },
  locInfo:    { flex: 1 },
  locText:    { fontFamily: 'DMSans-Regular', fontSize: 13, color: '#F0F4FF', lineHeight: 20 },
  locEdit:    { fontFamily: 'DMSans-Regular', fontSize: 12, color: '#00E5FF', marginTop: 4 },

  miniMapa:         { height: 140, backgroundColor: '#0A1628', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' },
  miniMapaBg:       { position: 'absolute', inset: 0, backgroundColor: '#0A1628' } as any,
  miniMapaLine:     { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(0,229,255,0.05)' },
  miniMapaLineH:    { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(0,229,255,0.05)' },
  miniMapaPin:      { position: 'absolute', bottom: 50, left: width * 0.25, alignItems: 'center', justifyContent: 'center' },
  miniMapaPinDot:   { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF3B5C', borderWidth: 2, borderColor: '#070B14' },
  miniMapaPinRing:  { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,59,92,0.4)' },
  miniMapaResgatista:    { position: 'absolute' },
  miniMapaResgatistIcon: { fontSize: 22 },
  miniMapaRota:     { position: 'absolute', bottom: 56, left: width * 0.27, right: width * 0.2, height: 1.5, backgroundColor: 'rgba(255,59,92,0.4)', borderStyle: 'dashed' },

  problemasGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  problemaCard:       { width: (width - 32 - 8) / 2 - 4, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8, position: 'relative' },
  problemaCardActive: { backgroundColor: 'rgba(255,59,92,0.08)', borderColor: 'rgba(255,59,92,0.3)' },
  problemaIcon:       { fontSize: 20 },
  problemaLabel:      { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.6)', lineHeight: 18 },
  problemaLabelActive:{ color: '#F0F4FF' },
  problemaCheck:      { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, backgroundColor: '#FF3B5C', alignItems: 'center', justifyContent: 'center' },
  problemaCheckText:  { fontSize: 10, color: '#fff', fontWeight: 'bold' },

  resumoCard:    { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 16, marginBottom: 20 },
  resumoRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  resumoLabel:   { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)' },
  resumoValue:   { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  resumoDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  btns:             { gap: 10 },
  btnConfirmar:     { height: 56, backgroundColor: '#FF3B5C', borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF3B5C', shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  btnConfirmando:   { opacity: 0.7 },
  btnConfirmarText: { fontFamily: 'Syne-Bold', fontSize: 16, color: '#fff', letterSpacing: 0.3 },
  btnCancelar:      { height: 50, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnCancelarText:  { fontFamily: 'DMSans-Regular', fontSize: 15, color: 'rgba(240,244,255,0.5)' },
});
