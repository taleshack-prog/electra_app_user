import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const METODOS = [
  { id: '1', icon: '💳', label: 'Cartão de crédito', sub: 'Visa •••• 4242' },
  { id: '2', icon: '📱', label: 'PIX',               sub: 'Instantâneo' },
  { id: '3', icon: '₿',  label: 'Cripto',            sub: 'BTC, ETH, USDT' },
];

export default function CheckoutRecargaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  const [metodoPagto, setMetodoPagto] = useState('1');
  const [pago, setPago] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePagar = () => {
    setPago(true);
    Animated.spring(checkAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    setTimeout(() => navigation.replace('MainTabs'), 2500);
  };

  if (pago) {
    return (
      <View style={styles.pagoRoot}>
        <StatusBar barStyle="light-content" backgroundColor="#070B14" />
        <Animated.View style={[styles.pagoWrap, { opacity: fadeAnim, transform: [{ scale: checkAnim }] }]}>
          <View style={styles.pagoCircle}>
            <Text style={styles.pagoCheck}>✓</Text>
          </View>
          <Text style={styles.pagoTitle}>Pagamento Confirmado!</Text>
          <Text style={styles.pagoSub}>Recibo enviado para seu e-mail</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* Resumo da sessão */}
        <Animated.View style={[styles.resumoCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionLabel}>RESUMO DA SESSÃO</Text>

          <View style={styles.resumoEstacao}>
            <View style={styles.resumoIconWrap}>
              <Text style={styles.resumoIcon}>⚡</Text>
            </View>
            <View>
              <Text style={styles.resumoEstacaoNome}>Eletroposto Central</Text>
              <Text style={styles.resumoEstacaoSub}>CCS2 · DC Rápido · 150kW</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {[
            { label: 'Energia consumida',  val: '32,5 kWh' },
            { label: 'Duração',            val: '42 min' },
            { label: 'Bateria inicial',    val: '12%' },
            { label: 'Bateria final',      val: '80%' },
            { label: 'Preço/kWh',          val: 'R$ 3,20' },
          ].map((r, i) => (
            <View key={i} style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>{r.label}</Text>
              <Text style={styles.resumoVal}>{r.val}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>R$ 104,00</Text>
          </View>

          {/* Ganho de pontos */}
          <View style={styles.pontosBox}>
            <Text style={styles.pontosIcon}>🏆</Text>
            <Text style={styles.pontosText}>
              Você vai ganhar <Text style={styles.pontosHighlight}>+325 pontos</Text> ELECTRA nesta recarga
            </Text>
          </View>
        </Animated.View>

        {/* Método de pagamento */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>MÉTODO DE PAGAMENTO</Text>
          {METODOS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[styles.metodoPill, metodoPagto === m.id && styles.metodoPillActive]}
              onPress={() => setMetodoPagto(m.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.metodoIcon}>{m.icon}</Text>
              <View style={styles.metodoInfo}>
                <Text style={[styles.metodoLabel, metodoPagto === m.id && styles.metodoLabelActive]}>
                  {m.label}
                </Text>
                <Text style={styles.metodoSub}>{m.sub}</Text>
              </View>
              <View style={[styles.radio, metodoPagto === m.id && styles.radioActive]}>
                {metodoPagto === m.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Info segurança */}
        <Animated.View style={[styles.segBox, { opacity: fadeAnim }]}>
          <Text style={styles.segIcon}>🔒</Text>
          <Text style={styles.segText}>Pagamento seguro com criptografia PCI-DSS</Text>
        </Animated.View>

        {/* Botão pagar */}
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.btnPagar} onPress={handlePagar} activeOpacity={0.85}>
            <Text style={styles.btnPagarText}>Pagar R$ 104,00</Text>
            <Text style={styles.btnPagarArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.replace('MainTabs')}>
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

  pagoRoot: { flex: 1, backgroundColor: '#070B14', alignItems: 'center', justifyContent: 'center' },
  pagoWrap: { alignItems: 'center', gap: 16 },
  pagoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,255,135,0.12)', borderWidth: 2, borderColor: '#00FF87', alignItems: 'center', justifyContent: 'center', shadowColor: '#00FF87', shadowOpacity: 0.4, shadowRadius: 24, elevation: 10 },
  pagoCheck:  { fontSize: 48, color: '#00FF87' },
  pagoTitle:  { fontFamily: 'Syne-Bold', fontSize: 24, color: '#F0F4FF' },
  pagoSub:    { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.4)' },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { fontSize: 18, color: 'rgba(240,244,255,0.6)' },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },

  sectionLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 12 },

  resumoCard:       { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 22, padding: 18, marginBottom: 16 },
  resumoEstacao:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  resumoIconWrap:   { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  resumoIcon:       { fontSize: 20 },
  resumoEstacaoNome:{ fontFamily: 'Syne-Bold', fontSize: 15, color: '#F0F4FF' },
  resumoEstacaoSub: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  divider:          { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 10 },
  resumoRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  resumoLabel:      { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)' },
  resumoVal:        { fontFamily: 'DMSans-Regular', fontSize: 13, color: '#F0F4FF' },
  totalRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  totalLabel:       { fontFamily: 'Syne-Bold', fontSize: 16, color: '#F0F4FF' },
  totalVal:         { fontFamily: 'Syne-Bold', fontSize: 24, color: '#00E5FF' },
  pontosBox:        { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,184,0,0.08)', borderRadius: 12, padding: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)' },
  pontosIcon:       { fontSize: 16 },
  pontosText:       { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.6)', lineHeight: 20 },
  pontosHighlight:  { color: '#FFB800', fontWeight: '600' },

  section:          { marginBottom: 16 },
  metodoPill:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, marginBottom: 8 },
  metodoPillActive: { borderColor: 'rgba(0,229,255,0.4)', backgroundColor: 'rgba(0,229,255,0.06)' },
  metodoIcon:       { fontSize: 22 },
  metodoInfo:       { flex: 1 },
  metodoLabel:      { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.7)' },
  metodoLabelActive:{ color: '#F0F4FF', fontWeight: '600' },
  metodoSub:        { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.35)', marginTop: 2 },
  radio:            { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  radioActive:      { borderColor: '#00E5FF' },
  radioDot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00E5FF' },

  segBox:   { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,255,135,0.05)', borderRadius: 12, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(0,255,135,0.1)' },
  segIcon:  { fontSize: 16 },
  segText:  { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },

  btnPagar:      { height: 56, backgroundColor: '#00E5FF', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10, shadowColor: '#00E5FF', shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  btnPagarText:  { fontFamily: 'Syne-Bold', fontSize: 16, color: '#000' },
  btnPagarArrow: { fontFamily: 'Syne-Bold', fontSize: 18, color: '#000' },
  btnCancelar:   { height: 48, alignItems: 'center', justifyContent: 'center' },
  btnCancelarText:{ fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.35)' },
});
