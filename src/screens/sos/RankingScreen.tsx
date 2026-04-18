import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');

const RANKING = [
  { pos: 1, nome: 'Marina Costa',  pontos: 4820, recargas: 47, badge: '🥇', nivel: 'Lenda' },
  { pos: 2, nome: 'Pedro Alves',   pontos: 3910, recargas: 38, badge: '🥈', nivel: 'Mestre' },
  { pos: 3, nome: 'Ana Souza',     pontos: 3450, recargas: 32, badge: '🥉', nivel: 'Mestre' },
  { pos: 4, nome: 'João (você)',   pontos: 2840, recargas: 24, badge: '⚡', nivel: 'Ouro', isUser: true },
  { pos: 5, nome: 'Carlos Lima',   pontos: 2210, recargas: 19, badge: '⚡', nivel: 'Prata' },
  { pos: 6, nome: 'Lucia Ferreira',pontos: 1890, recargas: 15, badge: '⚡', nivel: 'Prata' },
];

const CONQUISTAS = [
  { icon: '⚡', nome: 'Primeiro Resgate',    desc: 'Completou o 1º SOS',        ok: true  },
  { icon: '🔋', nome: 'Bateria Consciente',   desc: '10 recargas preventivas',   ok: true  },
  { icon: '🏃', nome: 'Resposta Rápida',      desc: 'SOS em menos de 5 min',     ok: true  },
  { icon: '🌟', nome: '25 Recargas',          desc: 'Complete 25 recargas',      ok: false },
  { icon: '🏆', nome: 'Top 3 do Mês',         desc: 'Entre no top 3',            ok: false },
  { icon: '🌱', nome: 'EV Sustentável',       desc: '1000 km elétricos',         ok: false },
];

export default function RankingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const barAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(barAnim,   { toValue: 1, duration: 1200, useNativeDriver: false }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ranking</Text>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* Card do usuário */}
        <Animated.View style={[styles.userCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.userCardTop}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>JC</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>João (você)</Text>
              <View style={styles.nivelRow}>
                <View style={styles.nivelBadge}>
                  <Text style={styles.nivelText}>⚡ Ouro</Text>
                </View>
                <Text style={styles.posText}>#4 do ranking</Text>
              </View>
            </View>
            <View style={styles.pontosWrap}>
              <Text style={styles.pontosNum}>2.840</Text>
              <Text style={styles.pontosLabel}>pontos</Text>
            </View>
          </View>

          {/* Barra progresso para próximo nível */}
          <View style={styles.progressArea}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progresso para Mestre</Text>
              <Text style={styles.progressPct}>71%</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[
                styles.progressFill,
                { width: barAnim.interpolate({ inputRange: [0,1], outputRange: ['0%', '71%'] }) },
              ]} />
            </View>
            <Text style={styles.progressSub}>Faltam 1.070 pontos para Mestre</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>24</Text>
              <Text style={styles.statLabel}>Recargas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLabel}>Resgates</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>420</Text>
              <Text style={styles.statLabel}>km elétricos</Text>
            </View>
          </View>
        </Animated.View>

        {/* Ranking global */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>RANKING GLOBAL</Text>
          {RANKING.map((r, i) => (
            <Animated.View
              key={r.pos}
              style={[
                styles.rankCard,
                r.isUser && styles.rankCardUser,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.rankPos}>{r.badge}</Text>
              <View style={[styles.rankAvatar, r.isUser && styles.rankAvatarUser]}>
                <Text style={styles.rankAvatarText}>{r.nome.slice(0,2).toUpperCase()}</Text>
              </View>
              <View style={styles.rankInfo}>
                <Text style={[styles.rankNome, r.isUser && styles.rankNomeUser]}>{r.nome}</Text>
                <Text style={styles.rankNivel}>{r.nivel} · {r.recargas} recargas</Text>
              </View>
              <View style={styles.rankPontos}>
                <Text style={[styles.rankPontosNum, r.isUser && { color: '#00E5FF' }]}>
                  {r.pontos.toLocaleString()}
                </Text>
                <Text style={styles.rankPontosLabel}>pts</Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Conquistas */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>CONQUISTAS</Text>
          <View style={styles.conquistasGrid}>
            {CONQUISTAS.map((c, i) => (
              <View key={i} style={[styles.conquistaCard, !c.ok && styles.conquistaCardLocked]}>
                <Text style={[styles.conquistaIcon, !c.ok && styles.conquistaIconLocked]}>
                  {c.ok ? c.icon : '🔒'}
                </Text>
                <Text style={[styles.conquistaNome, !c.ok && styles.conquistaTextLocked]}>
                  {c.nome}
                </Text>
                <Text style={styles.conquistaDesc}>{c.desc}</Text>
                {c.ok && <View style={styles.conquistaCheck}><Text style={{ fontSize: 10, color: '#00FF87' }}>✓</Text></View>}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaCard, { opacity: fadeAnim }]}>
          <Text style={styles.ctaIcon}>🚀</Text>
          <View style={styles.ctaInfo}>
            <Text style={styles.ctaTitle}>Suba no ranking!</Text>
            <Text style={styles.ctaSub}>Use o ELECTRA mais e ganhe pontos</Text>
          </View>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.replace('MainTabs')}
          >
            <Text style={styles.ctaBtnText}>Explorar</Text>
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

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { fontSize: 18, color: 'rgba(240,244,255,0.6)' },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },

  userCard:    { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', borderRadius: 22, padding: 18, marginBottom: 20 },
  userCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  userAvatar:  { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 1.5, borderColor: '#00E5FF', alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { fontFamily: 'Syne-Bold', fontSize: 16, color: '#00E5FF' },
  userInfo:    { flex: 1 },
  userName:    { fontFamily: 'Syne-Bold', fontSize: 15, color: '#F0F4FF', marginBottom: 4 },
  nivelRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nivelBadge:  { backgroundColor: 'rgba(255,184,0,0.15)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  nivelText:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#FFB800' },
  posText:     { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  pontosWrap:  { alignItems: 'flex-end' },
  pontosNum:   { fontFamily: 'Syne-Bold', fontSize: 22, color: '#00E5FF' },
  pontosLabel: { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)' },

  progressArea:   { marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel:  { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  progressPct:    { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, color: '#FFB800' },
  progressTrack:  { height: 5, backgroundColor: '#1A2236', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill:   { height: 5, backgroundColor: '#FFB800', borderRadius: 3 },
  progressSub:    { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.3)' },

  statsRow:    { flexDirection: 'row', backgroundColor: '#0D1320', borderRadius: 14, padding: 12 },
  statItem:    { flex: 1, alignItems: 'center' },
  statNum:     { fontFamily: 'Syne-Bold', fontSize: 20, color: '#F0F4FF' },
  statLabel:   { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.35)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)' },

  section:      { marginBottom: 20 },
  sectionLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 10 },

  rankCard:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 12, marginBottom: 8 },
  rankCardUser: { backgroundColor: 'rgba(0,229,255,0.06)', borderColor: 'rgba(0,229,255,0.2)' },
  rankPos:      { fontSize: 22, width: 30, textAlign: 'center' },
  rankAvatar:   { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', alignItems: 'center', justifyContent: 'center' },
  rankAvatarUser: { backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 1.5, borderColor: '#00E5FF' },
  rankAvatarText: { fontFamily: 'Syne-Bold', fontSize: 12, color: 'rgba(240,244,255,0.6)' },
  rankInfo:     { flex: 1 },
  rankNome:     { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.8)' },
  rankNomeUser: { color: '#F0F4FF', fontWeight: '600' },
  rankNivel:    { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.35)', marginTop: 2 },
  rankPontos:   { alignItems: 'flex-end' },
  rankPontosNum:{ fontFamily: 'Syne-Bold', fontSize: 16, color: '#F0F4FF' },
  rankPontosLabel: { fontFamily: 'DMSans-Regular', fontSize: 10, color: 'rgba(240,244,255,0.3)' },

  conquistasGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  conquistaCard:        { width: (width - 32 - 8) / 2 - 4, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, position: 'relative' },
  conquistaCardLocked:  { opacity: 0.4 },
  conquistaIcon:        { fontSize: 24, marginBottom: 6 },
  conquistaIconLocked:  { opacity: 0.5 },
  conquistaNome:        { fontFamily: 'Syne-Bold', fontSize: 13, color: '#F0F4FF', marginBottom: 3 },
  conquistaTextLocked:  { color: 'rgba(240,244,255,0.5)' },
  conquistaDesc:        { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.35)', lineHeight: 16 },
  conquistaCheck:       { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(0,255,135,0.2)', borderWidth: 1, borderColor: '#00FF87', alignItems: 'center', justifyContent: 'center' },

  ctaCard:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(0,229,255,0.06)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.15)', borderRadius: 16, padding: 16 },
  ctaIcon:  { fontSize: 28 },
  ctaInfo:  { flex: 1 },
  ctaTitle: { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  ctaSub:   { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  ctaBtn:   { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#00E5FF', borderRadius: 10 },
  ctaBtnText: { fontFamily: 'Syne-Bold', fontSize: 13, color: '#000' },
});
