import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { height } = Dimensions.get('window');

export default function Onboarding1Screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const ringScale = useRef(new Animated.Value(0.7)).current;
  const ringAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ringAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(ringScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
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

      {/* BG glow */}
      <View style={styles.glow} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      {/* Ícone central */}
      <View style={styles.iconArea}>
        <Animated.View style={[styles.ringOuter, { opacity: ringAnim, transform: [{ scale: ringScale }] }]} />
        <Animated.View style={[styles.ringInner, { opacity: ringAnim, transform: [{ scale: ringScale }] }]} />
        <Animated.View style={[styles.iconCircle, { opacity: ringAnim, transform: [{ scale: ringScale }] }]}>
          {/* Raio */}
          <View style={styles.boltTop} />
          <View style={styles.boltBottom} />
        </Animated.View>
      </View>

      {/* Texto */}
      <Animated.View style={[styles.textArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.label}>ELECTRA RESCUE</Text>
        <Text style={styles.title}>Energia onde{'\n'}você precisar</Text>
        <Text style={styles.subtitle}>
          Carregamento móvel para seu veículo elétrico, em qualquer lugar da cidade.
        </Text>
      </Animated.View>

      {/* Dots + CTA */}
      <Animated.View style={[styles.bottom, { opacity: fadeAnim }]}>
        {/* Dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Onboarding2')}
        >
          <Text style={styles.btnText}>Próximo</Text>
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
    backgroundColor: 'rgba(0,229,255,0.05)', top: height * 0.15,
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
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.08)',
  },
  ringInner: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.12)',
  },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(0,229,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  boltTop: {
    width: 0, height: 0,
    borderLeftWidth: 10, borderRightWidth: 4, borderBottomWidth: 22,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderBottomColor: '#00E5FF',
    marginBottom: -4, marginLeft: 6,
  },
  boltBottom: {
    width: 0, height: 0,
    borderLeftWidth: 4, borderRightWidth: 10, borderTopWidth: 22,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#00E5FF',
    marginRight: 6, opacity: 0.85,
  },

  textArea: { paddingHorizontal: 32, alignItems: 'center', marginBottom: 40 },
  label:    { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#00E5FF', letterSpacing: 4, marginBottom: 16, textTransform: 'uppercase' },
  title:    { fontFamily: 'Syne-Bold', fontSize: 32, color: '#F0F4FF', textAlign: 'center', lineHeight: 38, marginBottom: 16, letterSpacing: -0.5 },
  subtitle: { fontFamily: 'DMSans-Regular', fontSize: 15, color: 'rgba(240,244,255,0.4)', textAlign: 'center', lineHeight: 24 },

  bottom:     { width: '100%', paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  dots:       { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot:        { width: 6, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotActive:  { width: 20, backgroundColor: '#00E5FF' },
  btnPrimary: {
    width: '100%', height: 54, backgroundColor: '#00E5FF',
    borderRadius: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    shadowColor: '#00E5FF', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  btnText:  { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  btnArrow: { fontFamily: 'Syne-Bold', fontSize: 16, color: '#000' },
});
