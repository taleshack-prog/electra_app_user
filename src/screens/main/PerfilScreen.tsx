import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');

const VEICULOS = [
  { id: '1', modelo: 'BYD Seal 03', placa: 'ABC-1234', apelido: 'Meu BYD', bateria: 42 },
  { id: '2', modelo: 'BYD Dolphin', placa: 'XYZ-5678', apelido: 'Dolphin',  bateria: 78 },
];

const CONQUISTAS = [
  { icon: '⚡', nome: 'Primeiro Resgate', ok: true  },
  { icon: '🔋', nome: 'Bateria Consciente', ok: true  },
  { icon: '🏃', nome: 'Resposta Rápida',   ok: true  },
  { icon: '🌟', nome: '25 Recargas',       ok: false },
  { icon: '🏆', nome: 'Top 3 do Mês',      ok: false },
  { icon: '🌱', nome: 'EV Sustentável',    ok: false },
];

const MENU_ITEMS = [
  { icon: '🚗', label: 'Meus Veículos',       sub: '2 veículos cadastrados', rota: 'MeusVeiculos' },
  { icon: '💳', label: 'Pagamentos', sub: 'Cartão e PIX', rota: 'Pagamentos' },
  { icon: '🔔', label: 'Notificações', sub: 'Alertas ativos', rota: 'Notificacoes' },
  { icon: '🛡', label: 'Privacidade', sub: 'LGPD · seus dados', rota: 'Privacidade' },
  { icon: '❓', label: 'Suporte', sub: 'Falar com a equipe', rota: 'Suporte' },
  { icon: '📄', label: 'Termos de Uso',        sub: 'Versão 2.1' },
];

export default function PerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
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
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Card do usuário */}
        <Animated.View style={[styles.userCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.userTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JC</Text>
              </View>
              <TouchableOpacity style={styles.avatarEdit}>
                <Text style={styles.avatarEditIcon}>✏</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>João Costa</Text>
              <Text style={styles.userEmail}>joao@email.com</Text>
              <View style={styles.nivelRow}>
                <View style={styles.nivelBadge}>
                  <Text style={styles.nivelText}>⚡ Nível Ouro</Text>
                </View>
              </View>
            </View>
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
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>2.840</Text>
              <Text style={styles.statLabel}>pontos</Text>
            </View>
          </View>
        </Animated.View>

        {/* Ranking */}
        <Animated.View style={[styles.rankCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.rankHeader}>
            <Text style={styles.sectionLabel}>MEU RANKING</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Ranking')}>
              <Text style={styles.verTudo}>Ver ranking completo →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rankPos}>
            <Text style={styles.rankPosNum}>#4</Text>
            <View style={styles.rankPosInfo}>
              <Text style={styles.rankPosTitle}>Global este mês</Text>
              <Text style={styles.rankPosSub}>Top 10% dos usuários</Text>
            </View>
            <View style={styles.rankTrophy}>
              <Text style={styles.rankTrophyIcon}>🏆</Text>
            </View>
          </View>

          {/* Barra progresso */}
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Para o nível Mestre</Text>
            <Text style={styles.progressPct}>71%</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[
              styles.progressFill,
              { width: barAnim.interpolate({ inputRange: [0,1], outputRange: ['0%', '71%'] }) },
            ]} />
          </View>
          <Text style={styles.progressSub}>Faltam 1.070 pontos</Text>
        </Animated.View>

        {/* Veículos */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>MEUS VEÍCULOS</Text>
            <TouchableOpacity>
              <Text style={styles.verTudo}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          {VEICULOS.map(v => (
            <View key={v.id} style={styles.veiculoCard}>
              <View style={styles.veiculoIcon}>
                <Text style={styles.veiculoIconText}>🚗</Text>
              </View>
              <View style={styles.veiculoInfo}>
                <Text style={styles.veiculoApelido}>{v.apelido}</Text>
                <Text style={styles.veiculoModelo}>{v.modelo} · {v.placa}</Text>
                <View style={styles.veiculoBateriaRow}>
                  <View style={styles.veiculoBateriaTrack}>
                    <View style={[
                      styles.veiculoBateriaFill,
                      {
                        width: `${v.bateria}%` as any,
                        backgroundColor: v.bateria <= 20 ? '#FF3B5C' : v.bateria <= 40 ? '#FFB800' : '#00E5FF',
                      },
                    ]} />
                  </View>
                  <Text style={styles.veiculoBateriaPct}>{v.bateria}%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.veiculoEditBtn}>
                <Text style={styles.veiculoEditIcon}>✏</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>

        {/* Conquistas */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>CONQUISTAS</Text>
            <Text style={styles.conquistasCount}>3/6</Text>
          </View>
          <View style={styles.conquistasGrid}>
            {CONQUISTAS.map((c, i) => (
              <View key={i} style={[styles.conquistaCard, !c.ok && styles.conquistaLocked]}>
                <Text style={styles.conquistaIcon}>{c.ok ? c.icon : '🔒'}</Text>
                <Text style={[styles.conquistaNome, !c.ok && styles.conquistaLockedText]}>{c.nome}</Text>
                {c.ok && <View style={styles.conquistaCheck}><Text style={{ fontSize: 9, color: '#00FF87' }}>✓</Text></View>}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Menu */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>CONFIGURAÇÕES</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, i) => (
              <View key={i}>
                <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => (item as any).rota && navigation.navigate((item as any).rota as any)}>
                  <View style={styles.menuIconWrap}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
                {i < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View style={[{ opacity: fadeAnim, paddingHorizontal: 0, marginBottom: 20 }]}>
          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
          <Text style={styles.versao}>ELECTRA Rescue v1.0.0</Text>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  scroll: { flexGrow: 1, paddingHorizontal: 16 },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 22, color: '#F0F4FF' },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  settingsIcon:{ fontSize: 16 },

  userCard:  { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 22, padding: 18, marginBottom: 12 },
  userTop:   { flexDirection: 'row', gap: 14, marginBottom: 16 },
  avatarWrap:{ position: 'relative' },
  avatar:    { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 2, borderColor: '#00E5FF', alignItems: 'center', justifyContent: 'center' },
  avatarText:{ fontFamily: 'Syne-Bold', fontSize: 22, color: '#00E5FF' },
  avatarEdit:{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: '#00E5FF', alignItems: 'center', justifyContent: 'center' },
  avatarEditIcon: { fontSize: 10, color: '#000' },
  userInfo:  { flex: 1, justifyContent: 'center' },
  userName:  { fontFamily: 'Syne-Bold', fontSize: 18, color: '#F0F4FF', marginBottom: 3 },
  userEmail: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)', marginBottom: 6 },
  nivelRow:  { flexDirection: 'row' },
  nivelBadge:{ backgroundColor: 'rgba(255,184,0,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  nivelText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#FFB800' },

  statsRow:    { flexDirection: 'row', backgroundColor: '#0D1320', borderRadius: 14, padding: 12 },
  statItem:    { flex: 1, alignItems: 'center' },
  statNum:     { fontFamily: 'Syne-Bold', fontSize: 18, color: '#F0F4FF' },
  statLabel:   { fontFamily: 'DMSans-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)' },

  rankCard:    { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)', borderRadius: 20, padding: 16, marginBottom: 12 },
  rankHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rankPos:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  rankPosNum:  { fontFamily: 'Syne-Bold', fontSize: 40, color: '#FFB800', letterSpacing: -1 },
  rankPosInfo: { flex: 1 },
  rankPosTitle:{ fontFamily: 'Syne-Bold', fontSize: 15, color: '#F0F4FF' },
  rankPosSub:  { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  rankTrophy:  { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,184,0,0.1)', alignItems: 'center', justifyContent: 'center' },
  rankTrophyIcon: { fontSize: 22 },

  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel:  { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  progressPct:    { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, color: '#FFB800' },
  progressTrack:  { height: 5, backgroundColor: '#1A2236', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill:   { height: 5, backgroundColor: '#FFB800', borderRadius: 3 },
  progressSub:    { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.3)' },

  section:       { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionLabel:  { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2 },
  verTudo:       { fontFamily: 'DMSans-Regular', fontSize: 13, color: '#00E5FF' },
  conquistasCount: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#FFB800' },

  veiculoCard:        { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 8 },
  veiculoIcon:        { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  veiculoIconText:    { fontSize: 20 },
  veiculoInfo:        { flex: 1 },
  veiculoApelido:     { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  veiculoModelo:      { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 2, marginBottom: 6 },
  veiculoBateriaRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  veiculoBateriaTrack:{ flex: 1, height: 4, backgroundColor: '#1A2236', borderRadius: 2, overflow: 'hidden' },
  veiculoBateriaFill: { height: 4, borderRadius: 2 },
  veiculoBateriaPct:  { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.4)', width: 28 },
  veiculoEditBtn:     { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1A2236', alignItems: 'center', justifyContent: 'center' },
  veiculoEditIcon:    { fontSize: 13 },

  conquistasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  conquistaCard:  { width: (width - 32 - 16) / 3 - 1, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 12, alignItems: 'center', gap: 4, position: 'relative' },
  conquistaLocked:{ opacity: 0.4 },
  conquistaIcon:  { fontSize: 22 },
  conquistaNome:  { fontFamily: 'DMSans-Regular', fontSize: 10, color: '#F0F4FF', textAlign: 'center', lineHeight: 14 },
  conquistaLockedText: { color: 'rgba(240,244,255,0.4)' },
  conquistaCheck: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(0,255,135,0.2)', borderWidth: 1, borderColor: '#00FF87', alignItems: 'center', justifyContent: 'center' },

  menuCard:    { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' },
  menuItem:    { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuIconWrap:{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#1A2236', alignItems: 'center', justifyContent: 'center' },
  menuIcon:    { fontSize: 16 },
  menuInfo:    { flex: 1 },
  menuLabel:   { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#F0F4FF' },
  menuSub:     { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.35)', marginTop: 1 },
  menuArrow:   { fontSize: 20, color: 'rgba(240,244,255,0.2)' },
  menuDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginLeft: 62 },

  logoutBtn:  { height: 50, borderWidth: 1, borderColor: 'rgba(255,59,92,0.25)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoutText: { fontFamily: 'DMSans-Regular', fontSize: 15, color: '#FF3B5C' },
  versao:     { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.2)', textAlign: 'center' },
});
