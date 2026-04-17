import React, { useEffect, useRef } from 'react';
import {
  View, Animated, StyleSheet, Dimensions, StatusBar, Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width, height } = Dimensions.get('window');

// Simula verificação de sessão
// Depois conecta ao Supabase: supabase.auth.getSession()
const checkSession = async (): Promise<boolean> => {
  return false; // false = novo usuário, true = já cadastrado
};

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const logoScale   = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const barWidth    = useRef(new Animated.Value(0)).current;
  const barOpacity  = useRef(new Animated.Value(0)).current;
  const ring1Opacity= useRef(new Animated.Value(0)).current;
  const ring1Scale  = useRef(new Animated.Value(0.6)).current;
  const ring2Opacity= useRef(new Animated.Value(0)).current;
  const ring2Scale  = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#070B14');

    Animated.sequence([
      Animated.parallel([
        Animated.timing(ring1Opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(ring1Scale,   { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(logoOpacity,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale,    { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(ring2Opacity, { toValue: 0.6, duration: 400, useNativeDriver: true }),
        Animated.timing(ring2Scale,   { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(tagOpacity,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(barOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(barWidth,   { toValue: 180, duration: 1200, useNativeDriver: false }),
      ]),
    ]).start(async () => {
      // Verifica se usuário já tem sessão
      const hasSession = await checkSession();
      setTimeout(() => {
        if (hasSession) {
          navigation.replace('MainTabs'); // Já cadastrado → Home
        } else {
          navigation.replace('Onboarding1'); // Novo usuário → Onboarding
        }
      }, 300);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <View style={styles.glow} />
      <Animated.View style={[styles.ring, styles.ring1, { opacity: ring1Opacity, transform: [{ scale: ring1Scale }] }]} />
      <Animated.View style={[styles.ring, styles.ring2, { opacity: ring2Opacity, transform: [{ scale: ring2Scale }] }]} />
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.iconOuter}>
          <View style={styles.iconInner}>
            <View style={styles.boltTop} />
            <View style={styles.boltBottom} />
          </View>
        </View>
      </Animated.View>
      <Animated.Text style={[styles.wordmark, { opacity: textOpacity }]}>ELECTRA</Animated.Text>
      <Animated.Text style={[styles.tag, { opacity: tagOpacity }]}>RESCUE</Animated.Text>
      <Animated.View style={[styles.barContainer, { opacity: barOpacity }]}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#070B14', alignItems: 'center', justifyContent: 'center' },
  glow:          { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(0,229,255,0.04)', top: height / 2 - 180, left: width / 2 - 150 },
  ring:          { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  ring1:         { width: 260, height: 260, borderColor: 'rgba(0,229,255,0.08)' },
  ring2:         { width: 190, height: 190, borderColor: 'rgba(0,229,255,0.12)' },
  logoContainer: { marginBottom: 28 },
  iconOuter:     { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,229,255,0.1)', borderWidth: 1.5, borderColor: 'rgba(0,229,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  iconInner:     { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  boltTop:       { width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 4, borderBottomWidth: 22, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#00E5FF', marginBottom: -4, marginLeft: 6 },
  boltBottom:    { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 10, borderTopWidth: 22, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#00E5FF', marginRight: 6, opacity: 0.85 },
  wordmark:      { fontFamily: 'Syne-Bold', fontSize: 36, color: '#F0F4FF', letterSpacing: -0.5, marginBottom: 8 },
  tag:           { fontFamily: 'JetBrainsMono-Regular', fontSize: 13, color: '#00E5FF', letterSpacing: 6, marginBottom: 60 },
  barContainer:  { position: 'absolute', bottom: 80 },
  barTrack:      { width: 180, height: 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 1, overflow: 'hidden' },
  barFill:       { height: 2, backgroundColor: '#00E5FF', borderRadius: 1 },
});
