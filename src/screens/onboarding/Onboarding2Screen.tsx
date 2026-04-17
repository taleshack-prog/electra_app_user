import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { height } = Dimensions.get('window');

export default function Onboarding2Screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const iconAnim  = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(iconScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* BG glow verde */}
      <View style={styles.glow} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      {/* Ícone IA */}
      <View style={styles.iconArea}>
        <Animated.View style={[styles.ringOuter, { opacity: iconAnim, transform: [{ scale: iconScale }] }]} />
        <Animated.View style={[styles.ringInner, { opacity: iconAnim, transform: [{ scale: iconScale }] }]} />
        <Animated.View style={[styles.iconCircle, { opacity: iconAnim, transform: [{ scale: iconScale }] }]}>
          {/* Ícone cérebro simplificado */}
          <View style={styles.brainOuter}>
            <View style={styles.brainInner} />
            <View style={styles.brainDot} />
          </View>
        </Animated.View>
      </View>

      {/* Texto */}
      <Animated.View style={[styles.textArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.label}>IA INTEGRADA</Text>
        <Text style={styles.title}>Inteligência que{'\n'}evita você parar</Text>
        <Text style={styles.subtitle}>
          Monitoramos sua autonomia e avisamos antes que você fique sem bateria.
        </Text>
      </Animated.View>

      {/* Dots + CTA */}
      <Animated.View style={[styles.bottom, { opacity: fadeAnim }]}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.btnText}>Começar</Text>
          <Text style={styles.btnArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B14', alignItems: 'center' },
  glow: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(0,255,135,0.04)', top: height * 0.15,
  },
  skipBtn: {
    alignSelf: 'flex-end', margin: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: '#1A2236', borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  skipText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)' },

  iconArea: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -20 },
  ringOuter: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    borderWidth: 1, borderColor: 'rgba(0,255,135,0.08)',
  },
  ringInner: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    borderWidth: 1, borderColor: 'rgba(0,255,135,0.12)',
  },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(0,255,135,0.08)',
    borderWidth: 1.5, borderColor: 'rgba(0,255,135,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  brainOuter: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: '#00FF87',
    alignItems: 'center', justifyContent: 'center',
  },
  brainInner: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,255,135,0.3)',
    borderWidth: 1.5, borderColor: '#00FF87',
  },
  brainDot: {
    position: 'absolute', bottom: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#00FF87',
  },

  textArea: { paddingHorizontal: 32, alignItems: 'center', marginBottom: 40 },
  label:    { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#00FF87', letterSpacing: 4, marginBottom: 16 },
  title:    { fontFamily: 'Syne-Bold', fontSize: 32, color: '#F0F4FF', textAlign: 'center', lineHeight: 38, marginBottom: 16, letterSpacing: -0.5 },
  subtitle: { fontFamily: 'DMSans-Regular', fontSize: 15, color: 'rgba(240,244,255,0.4)', textAlign: 'center', lineHeight: 24 },

  bottom:    { width: '100%', paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  dots:      { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot:       { width: 6, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotActive: { width: 20, backgroundColor: '#00FF87' },
  btnPrimary: {
    width: '100%', height: 54, backgroundColor: '#00FF87',
    borderRadius: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    shadowColor: '#00FF87', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  btnText:  { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  btnArrow: { fontFamily: 'Syne-Bold', fontSize: 16, color: '#000' },
});
