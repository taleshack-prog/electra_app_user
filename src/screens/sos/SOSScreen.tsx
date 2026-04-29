import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions, Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSOS } from '../../hooks/useSOS';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width, height } = Dimensions.get('window');

export default function SOSScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.6)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.4)).current;
  const ring3Scale = useRef(new Animated.Value(1)).current;
  const ring3Opacity = useRef(new Animated.Value(0.2)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;
  const [pressionado, setPressionado] = useState(false);
  const pressProgress = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // Ondas pulsantes
    const pulseRing = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale,   { toValue: 1.8, duration: 1800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0,   duration: 1800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale,   { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    pulseRing(ring1Scale, ring1Opacity, 0).start();
    pulseRing(ring2Scale, ring2Opacity, 600).start();
    pulseRing(ring3Scale, ring3Opacity, 1200).start();

    // Pulso do botão
    Animated.loop(
      Animated.sequence([
        Animated.timing(btnScale, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(btnScale, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    setPressionado(true);
    pressAnim.current = Animated.timing(pressProgress, {
      toValue: 1, duration: 2000, useNativeDriver: false,
    });
    pressAnim.current.start(({ finished }) => {
      if (finished) navigation.navigate('ConfirmarSocorro');
    });
  };

  const handlePressOut = () => {
    setPressionado(false);
    pressAnim.current?.stop();
    Animated.timing(pressProgress, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const borderColor = pressProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,59,92,0.3)', 'rgba(255,59,92,1)'],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Glow vermelho de fundo */}
      <View style={styles.bgGlow} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>SOS RESCUE</Text>
        <Text style={styles.headerSub}>Pressione e segure para acionar</Text>
      </Animated.View>

      {/* Área central — botão SOS */}
      <View style={styles.center}>

        {/* Ondas */}
        <Animated.View style={[styles.ring, { transform: [{ scale: ring3Scale }], opacity: ring3Opacity }]} />
        <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
        <Animated.View style={[styles.ring, styles.ring3, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />

        {/* Botão SOS */}
        <Animated.View style={[styles.btnWrap, { transform: [{ scale: btnScale }] }]}>
          <Animated.View style={[styles.btnBorder, { borderColor }]}>
            <TouchableOpacity
              style={styles.btn}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.btnSOS}>SOS</Text>
              <Text style={styles.btnSub}>
                {pressionado ? 'Aguarde...' : 'Pressione\ne segure'}
              </Text>

              {/* Anel de progresso */}
              {pressionado && (
                <Animated.View style={[
                  styles.progressRing,
                  {
                    borderColor: pressProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['rgba(255,59,92,0.3)', '#FF3B5C'],
                    }),
                  },
                ]} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Info cards */}
      <Animated.View style={[styles.infoArea, { opacity: fadeAnim }]}>
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱</Text>
            <Text style={styles.infoValue}>~8 min</Text>
            <Text style={styles.infoLabel}>Tempo médio</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoValue}>2,3 km</Text>
            <Text style={styles.infoLabel}>Resgatista mais próximo</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⚡</Text>
            <Text style={styles.infoValue}>42%</Text>
            <Text style={styles.infoLabel}>Sua bateria</Text>
          </View>
        </View>

        {/* Aviso */}
        <View style={styles.avisoBox}>
          <Text style={styles.avisoIcon}>⚠</Text>
          <Text style={styles.avisoText}>
            Use apenas em emergências reais. Acionamentos falsos afetam sua avaliação.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const BTN_SIZE = 180;
const RING_SIZE = BTN_SIZE + 40;

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#070B14' },
  bgGlow:  { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,59,92,0.05)', top: height * 0.2, left: width / 2 - 200 },

  header:     { alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  headerTitle:{ fontFamily: 'Syne-Bold', fontSize: 22, color: '#FF3B5C', letterSpacing: 2 },
  headerSub:  { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.4)', marginTop: 6 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  ring:  { position: 'absolute', width: RING_SIZE + 80, height: RING_SIZE + 80, borderRadius: (RING_SIZE + 80) / 2, borderWidth: 1.5, borderColor: 'rgba(255,59,92,0.5)' },
  ring2: { width: RING_SIZE + 40, height: RING_SIZE + 40, borderRadius: (RING_SIZE + 40) / 2 },
  ring3: { width: RING_SIZE,      height: RING_SIZE,      borderRadius: RING_SIZE / 2 },

  btnWrap:   { alignItems: 'center', justifyContent: 'center' },
  btnBorder: { width: BTN_SIZE + 16, height: BTN_SIZE + 16, borderRadius: (BTN_SIZE + 16) / 2, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  btn:       { width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2, backgroundColor: '#FF3B5C', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF3B5C', shadowOpacity: 0.6, shadowRadius: 30, elevation: 16 },
  btnSOS:    { fontFamily: 'Syne-Bold', fontSize: 48, color: '#fff', letterSpacing: 2, lineHeight: 52 },
  btnSub:    { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 4 },
  progressRing: { position: 'absolute', width: BTN_SIZE + 8, height: BTN_SIZE + 8, borderRadius: (BTN_SIZE + 8) / 2, borderWidth: 4, borderTopColor: 'transparent', borderRightColor: 'transparent' },

  infoArea: { paddingHorizontal: 20, paddingBottom: 40 },
  infoRow:  { flexDirection: 'row', gap: 8, marginBottom: 12 },
  infoCard: { flex: 1, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 12, alignItems: 'center', gap: 4 },
  infoIcon: { fontSize: 20 },
  infoValue:{ fontFamily: 'Syne-Bold', fontSize: 16, color: '#F0F4FF' },
  infoLabel:{ fontFamily: 'DMSans-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', textAlign: 'center' },

  avisoBox:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(255,184,0,0.08)', borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)', borderRadius: 14, padding: 14 },
  avisoIcon: { fontSize: 16, color: '#FFB800' },
  avisoText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.5)', lineHeight: 18 },
});
