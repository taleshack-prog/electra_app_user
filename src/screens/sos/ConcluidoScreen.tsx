import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions, Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width, height } = Dimensions.get('window');

export default function ConcluidoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.5)).current;
  const slideAnim   = useRef(new Animated.Value(40)).current;
  const ring1Scale  = useRef(new Animated.Value(0.8)).current;
  const ring1Opacity= useRef(new Animated.Value(0)).current;
  const ring2Scale  = useRef(new Animated.Value(0.8)).current;
  const ring2Opacity= useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Anéis
      Animated.parallel([
        Animated.timing(ring1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(ring1Scale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ring2Opacity, { toValue: 0.5, duration: 300, useNativeDriver: true }),
        Animated.spring(ring2Scale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]),
      // Ícone check
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]),
      // Conteúdo
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Glow verde */}
      <View style={styles.bgGlow} />

      {/* Anéis */}
      <Animated.View style={[styles.ring, styles.ring1, { opacity: ring1Opacity, transform: [{ scale: ring1Scale }] }]} />
      <Animated.View style={[styles.ring, styles.ring2, { opacity: ring2Opacity, transform: [{ scale: ring2Scale }] }]} />

      {/* Ícone check */}
      <Animated.View style={[styles.checkWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      </Animated.View>

      {/* Texto */}
      <Animated.View style={[styles.textArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Resgate Concluído!</Text>
        <Text style={styles.subtitle}>
          Seu veículo foi recarregado com sucesso.{'\n'}Boa viagem! 🎉
        </Text>
      </Animated.View>

      {/* Resumo */}
      <Animated.View style={[styles.resumoCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.resumoRow}>
          <Text style={styles.resumoIcon}>⚡</Text>
          <Text style={styles.resumoLabel}>Energia fornecida</Text>
          <Text style={styles.resumoValue}>8,5 kWh</Text>
        </View>
        <View style={styles.resumoDivider} />
        <View style={styles.resumoRow}>
          <Text style={styles.resumoIcon}>🔋</Text>
          <Text style={styles.resumoLabel}>Bateria após recarga</Text>
          <Text style={[styles.resumoValue, { color: '#00FF87' }]}>67%</Text>
        </View>
        <View style={styles.resumoDivider} />
        <View style={styles.resumoRow}>
          <Text style={styles.resumoIcon}>⏱</Text>
          <Text style={styles.resumoLabel}>Tempo de atendimento</Text>
          <Text style={styles.resumoValue}>23 min</Text>
        </View>
        <View style={styles.resumoDivider} />
        <View style={styles.resumoRow}>
          <Text style={styles.resumoIcon}>💰</Text>
          <Text style={styles.resumoLabel}>Valor cobrado</Text>
          <Text style={[styles.resumoValue, { color: '#00E5FF' }]}>R$ 85,00</Text>
        </View>
      </Animated.View>

      {/* Resgatista */}
      <Animated.View style={[styles.resgatistCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.resgatistAvatar}>
          <Text style={styles.resgatistAvatarText}>JC</Text>
        </View>
        <View style={styles.resgatistInfo}>
          <Text style={styles.resgatistNome}>João Costa</Text>
          <Text style={styles.resgatistSub}>Como foi o atendimento?</Text>
        </View>
        <View style={styles.starsRow}>
          {[1,2,3,4,5].map(s => (
            <TouchableOpacity key={s}>
              <Text style={styles.star}>⭐</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Botões */}
      <Animated.View style={[styles.btns, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.btnRanking}
          onPress={() => navigation.navigate('Ranking')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnRankingText}>🏆 Ver meu ranking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnHome}
          onPress={() => navigation.replace('MainTabs')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnHomeText}>Voltar ao início</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#070B14', alignItems: 'center', paddingHorizontal: 20 },
  bgGlow:  { position: 'absolute', width: 350, height: 350, borderRadius: 175, backgroundColor: 'rgba(0,255,135,0.05)', top: height * 0.05 },

  ring:  { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  ring1: { width: 220, height: 220, borderColor: 'rgba(0,255,135,0.15)', top: height * 0.08 },
  ring2: { width: 160, height: 160, borderColor: 'rgba(0,255,135,0.2)',  top: height * 0.11 },

  checkWrap:   { marginTop: 80, marginBottom: 24 },
  checkCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,255,135,0.12)', borderWidth: 2, borderColor: '#00FF87', alignItems: 'center', justifyContent: 'center', shadowColor: '#00FF87', shadowOpacity: 0.4, shadowRadius: 24, elevation: 10 },
  checkIcon:   { fontSize: 48, color: '#00FF87' },

  textArea: { alignItems: 'center', marginBottom: 24 },
  title:    { fontFamily: 'Syne-Bold', fontSize: 28, color: '#F0F4FF', letterSpacing: -0.5, marginBottom: 10 },
  subtitle: { fontFamily: 'DMSans-Regular', fontSize: 15, color: 'rgba(240,244,255,0.5)', textAlign: 'center', lineHeight: 24 },

  resumoCard:    { width: '100%', backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16, marginBottom: 12 },
  resumoRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  resumoIcon:    { fontSize: 16, width: 24 },
  resumoLabel:   { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)' },
  resumoValue:   { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  resumoDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  resgatistCard:   { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 14, marginBottom: 20 },
  resgatistAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 1.5, borderColor: '#00E5FF', alignItems: 'center', justifyContent: 'center' },
  resgatistAvatarText: { fontFamily: 'Syne-Bold', fontSize: 15, color: '#00E5FF' },
  resgatistInfo:   { flex: 1 },
  resgatistNome:   { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  resgatistSub:    { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  starsRow:        { flexDirection: 'row', gap: 2 },
  star:            { fontSize: 18 },

  btns:         { width: '100%', gap: 10 },
  btnRanking:   { height: 52, backgroundColor: 'rgba(255,184,0,0.1)', borderWidth: 1, borderColor: 'rgba(255,184,0,0.3)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnRankingText:{ fontFamily: 'Syne-Bold', fontSize: 15, color: '#FFB800' },
  btnHome:      { height: 52, backgroundColor: '#00FF87', borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#00FF87', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  btnHomeText:  { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
});
