import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sosPulse  = useRef(new Animated.Value(1)).current;

  // Dados mockados — conectar ao Supabase depois
  const bateria    = 42;
  const autonomia  = 168;
  const veiculo    = 'BYD Seal 03';
  const localizacao = 'São Paulo, SP';

  useEffect(() => {
    // Entrada
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Pulso bateria
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Pulso SOS
    Animated.loop(
      Animated.sequence([
        Animated.timing(sosPulse, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
        Animated.timing(sosPulse, { toValue: 1,    duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bateriaColor = bateria <= 20 ? '#FF3B5C' : bateria <= 40 ? '#FFB800' : '#00E5FF';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* MAPA — ocupa metade superior */}
      <View style={styles.mapArea}>
        {/* Fundo do mapa simulado */}
        <View style={styles.mapBg} />

        {/* Grid do mapa */}
        <View style={styles.mapGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.mapGridLine} />
          ))}
        </View>
        <View style={styles.mapGridH}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.mapGridLineH} />
          ))}
        </View>

        {/* Estações no mapa */}
        <View style={[styles.mapPin, { top: 130, left: 90, backgroundColor: 'rgba(0,255,135,0.15)', borderColor: '#00FF87' }]}>
          <Text style={[styles.mapPinIcon, { color: '#00FF87' }]}>⚡</Text>
        </View>
        <View style={[styles.mapPin, { top: 80, left: 210, backgroundColor: 'rgba(255,184,0,0.15)', borderColor: '#FFB800' }]}>
          <Text style={[styles.mapPinIcon, { color: '#FFB800' }]}>⚡</Text>
        </View>
        <View style={[styles.mapPin, { top: 200, left: 280, backgroundColor: 'rgba(0,255,135,0.15)', borderColor: '#00FF87' }]}>
          <Text style={[styles.mapPinIcon, { color: '#00FF87' }]}>⚡</Text>
        </View>

        {/* Pin do usuário */}
        <Animated.View style={[styles.userPinWrap, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.userPinRing} />
          <View style={styles.userPin} />
        </Animated.View>
        <View style={styles.userPinLabel}>
          <Text style={styles.userPinLabelText}>Você</Text>
        </View>

        {/* Header flutuante */}
        <Animated.View style={[styles.floatHeader, { opacity: fadeAnim }]}>
          <View style={styles.greetCard}>
            <Text style={styles.greetSub}>Olá,</Text>
            <Text style={styles.greetName}>João 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </Animated.View>

        {/* Legenda mapa */}
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

        {/* Gradiente inferior */}
        <View style={styles.mapGradient} />
      </View>

      {/* CARDS INFERIORES */}
      <ScrollView
        style={styles.cardsArea}
        contentContainerStyle={styles.cardsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Widget Bateria */}
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
              {/* Ícone bateria */}
              <View style={[styles.batIconOuter, { borderColor: bateriaColor }]}>
                <View style={[styles.batIconFill, { width: `${bateria}%` as any, backgroundColor: bateriaColor }]} />
              </View>
              <View style={[styles.batIconCap, { backgroundColor: bateriaColor }]} />
              <Text style={[styles.batteryStatus, { color: bateriaColor }]}>
                {bateria <= 20 ? '⚠ Crítico' : bateria <= 40 ? '⚡ Baixo' : '✓ OK'}
              </Text>
            </View>
          </View>

          {/* Barra de progresso */}
          <View style={styles.progressTrack}>
            <Animated.View style={[
              styles.progressFill,
              {
                width: `${bateria}%` as any,
                backgroundColor: bateriaColor,
              },
            ]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0%</Text>
            <Text style={[styles.progressLabel, { color: bateriaColor }]}>{bateria}% · {localizacao}</Text>
            <Text style={styles.progressLabel}>100%</Text>
          </View>
        </Animated.View>

        {/* Card IA RESCUE */}
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
                Com {bateria}% de bateria, você tem ~{autonomia}km. Posto de carregamento a{' '}
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

        {/* Botão SOS */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070B14' },

  // Mapa
  mapArea:     { height: height * 0.48, position: 'relative', overflow: 'hidden' },
  mapBg:       { position: 'absolute', inset: 0, backgroundColor: '#0A1628' } as any,
  mapGrid:     { position: 'absolute', inset: 0, flexDirection: 'row', justifyContent: 'space-around' } as any,
  mapGridLine: { width: 1, height: '100%', backgroundColor: 'rgba(0,229,255,0.06)' },
  mapGridH:    { position: 'absolute', inset: 0, justifyContent: 'space-around' } as any,
  mapGridLineH:{ height: 1, width: '100%', backgroundColor: 'rgba(0,229,255,0.06)' },

  mapPin:     { position: 'absolute', width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  mapPinIcon: { fontSize: 13 },

  userPinWrap:  { position: 'absolute', top: 230, left: width / 2 - 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  userPinRing:  { position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)' },
  userPin:      { width: 14, height: 14, borderRadius: 7, backgroundColor: '#00E5FF', borderWidth: 2.5, borderColor: '#070B14' },
  userPinLabel: { position: 'absolute', top: 255, left: width / 2 - 16 },
  userPinLabelText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: '#00E5FF', backgroundColor: 'rgba(7,11,20,0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

  floatHeader: { position: 'absolute', top: 48, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greetCard:   { backgroundColor: 'rgba(13,19,32,0.9)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  greetSub:    { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)' },
  greetName:   { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },
  notifBtn:    { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(13,19,32,0.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  notifIcon:   { fontSize: 18 },
  notifDot:    { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B5C', borderWidth: 1.5, borderColor: '#070B14' },

  mapLegend:  { position: 'absolute', bottom: 60, right: 14, gap: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(13,19,32,0.85)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  legendDot:  { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.6)' },

  mapGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(7,11,20,0.8)' },

  // Cards
  cardsArea:    { flex: 1, marginTop: -20 },
  cardsContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Bateria
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
  batIconCap:      { position: 'absolute', right: -5, top: '25%', width: 4, height: '50%', borderRadius: 2 } as any,
  batteryStatus:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 0.5 },
  progressTrack:   { height: 5, backgroundColor: '#1A2236', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill:    { height: 5, borderRadius: 3 },
  progressLabels:  { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 9, color: 'rgba(240,244,255,0.2)' },

  // IA Card
  iaCard:     { backgroundColor: 'rgba(0,229,255,0.06)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.18)', borderRadius: 20, padding: 16, marginBottom: 10 },
  iaHeader:   { flexDirection: 'row', gap: 10, marginBottom: 12 },
  iaIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iaIcon:     { fontSize: 18 },
  iaInfo:     { flex: 1 },
  iaLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  iaLabel:    { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: '#00E5FF', letterSpacing: 1 },
  iaBadge:    { backgroundColor: 'rgba(0,229,255,0.15)', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  iaBadgeText:{ fontFamily: 'JetBrainsMono-Regular', fontSize: 9, color: '#00E5FF', fontWeight: '600' },
  iaText:     { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.7)', lineHeight: 20 },
  iaCyan:     { color: '#00E5FF', fontWeight: '600' },
  iaBtns:     { flexDirection: 'row', gap: 8 },
  iaBtnPrimary:     { height: 34, paddingHorizontal: 16, backgroundColor: '#00E5FF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iaBtnPrimaryText: { fontFamily: 'Syne-Bold', fontSize: 13, color: '#000' },
  iaBtnSecondary:   { height: 34, paddingHorizontal: 14, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iaBtnSecondaryText:{ fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)' },

  // SOS Card
  sosCard:    { backgroundColor: 'rgba(255,59,92,0.08)', borderWidth: 1, borderColor: 'rgba(255,59,92,0.25)', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sosLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  sosIconWrap:{ width: 44, height: 44, borderRadius: 13, backgroundColor: 'rgba(255,59,92,0.15)', alignItems: 'center', justifyContent: 'center' },
  sosIconText:{ fontSize: 22 },
  sosTitle:   { fontFamily: 'Syne-Bold', fontSize: 15, color: '#F0F4FF', marginBottom: 2 },
  sosSub:     { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  sosBtnRight:{ width: 64, height: 44, backgroundColor: '#FF3B5C', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF3B5C', shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  sosBtnText: { fontFamily: 'Syne-Bold', fontSize: 16, color: '#fff', letterSpacing: 1 },
});
