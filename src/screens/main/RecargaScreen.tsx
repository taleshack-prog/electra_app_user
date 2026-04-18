import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');

type Aba = 'qr' | 'historico' | 'status';

const HISTORICO = [
  { id: '1', estacao: 'Eletroposto Central', data: 'Hoje, 09:14',  kwh: '32,5', custo: 'R$ 104,00', duracao: '42min', batInicio: 12, batFim: 80 },
  { id: '2', estacao: 'BYD Charge Hub',      data: 'Ontem, 18:32', kwh: '18,2', custo: 'R$  38,22', duracao: '51min', batInicio: 35, batFim: 75 },
  { id: '3', estacao: 'EV Station Plus',     data: '15/04, 14:05', kwh: '45,0', custo: 'R$ 126,00', duracao: '1h12', batInicio:  8, batFim: 95 },
  { id: '4', estacao: 'GreenCharge 24h',     data: '12/04, 08:20', kwh: '22,1', custo: 'R$  66,30', duracao: '35min', batInicio: 28, batFim: 68 },
];

const QR_HTML = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#0D1320;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;font-family:sans-serif;}.qr-wrap{width:180px;height:180px;background:white;border-radius:12px;display:flex;align-items:center;justify-content:center;padding:10px;position:relative;}.scan-line{position:absolute;width:160px;height:2px;background:linear-gradient(90deg,transparent,#00E5FF,transparent);animation:scan 2s linear infinite;}.scan-txt{color:rgba(240,244,255,0.4);font-size:13px;text-align:center;}@keyframes scan{0%{top:10px;opacity:0;}50%{opacity:1;}100%{top:170px;opacity:0;}}</style></head><body><div class="qr-wrap"><svg width="160" height="160" viewBox="0 0 21 21"><rect width="21" height="21" fill="white"/><rect x="0" y="0" width="7" height="7" fill="none" stroke="black" stroke-width="1"/><rect x="2" y="2" width="3" height="3" fill="black"/><rect x="14" y="0" width="7" height="7" fill="none" stroke="black" stroke-width="1"/><rect x="16" y="2" width="3" height="3" fill="black"/><rect x="0" y="14" width="7" height="7" fill="none" stroke="black" stroke-width="1"/><rect x="2" y="16" width="3" height="3" fill="black"/><rect x="9" y="1" width="1" height="2" fill="black"/><rect x="11" y="1" width="1" height="1" fill="black"/><rect x="9" y="4" width="2" height="1" fill="black"/><rect x="8" y="8" width="3" height="1" fill="black"/><rect x="12" y="8" width="2" height="2" fill="black"/><rect x="8" y="10" width="1" height="3" fill="black"/><rect x="10" y="11" width="3" height="1" fill="black"/><rect x="14" y="10" width="2" height="1" fill="black"/><rect x="16" y="9" width="3" height="2" fill="black"/><rect x="9" y="14" width="2" height="3" fill="black"/><rect x="12" y="15" width="1" height="2" fill="black"/><rect x="14" y="14" width="3" height="1" fill="black"/><rect x="17" y="15" width="2" height="3" fill="black"/><rect x="14" y="18" width="2" height="1" fill="black"/></svg><div class="scan-line"></div></div><div class="scan-txt">Aponte para o QR Code do conector</div></body></html>`;

export default function RecargaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [aba, setAba] = useState<Aba>('qr');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const ABAS: { key: Aba; label: string }[] = [
    { key: 'qr',       label: '📷 QR Code'  },
    { key: 'historico', label: '📋 Histórico' },
    { key: 'status',    label: '📊 Status'    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.headerTitle}>Recarga</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>⚡ 24 sessões</Text>
          </View>
        </Animated.View>

        {/* Abas */}
        <Animated.View style={[styles.abas, { opacity: fadeAnim }]}>
          {ABAS.map(a => (
            <TouchableOpacity
              key={a.key}
              style={[styles.aba, aba === a.key && styles.abaActive]}
              onPress={() => setAba(a.key)}
            >
              <Text style={[styles.abaText, aba === a.key && styles.abaTextActive]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ABA QR */}
        {aba === 'qr' && (
          <Animated.View style={[styles.qrArea, { opacity: fadeAnim }]}>
            <Text style={styles.qrTitle}>Iniciar Recarga</Text>
            <Text style={styles.qrSub}>Escaneie o QR Code na estação ou simule uma recarga</Text>

            <View style={styles.qrScanner}>
              <WebView
                source={{ html: QR_HTML }}
                style={{ width: 260, height: 260 }}
                javaScriptEnabled
                scrollEnabled={false}
                backgroundColor="#0D1320"
              />
            </View>

            {/* Botão Simular */}
            <TouchableOpacity
              style={styles.btnSimular}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('SessaoRecarga')}
            >
              <Text style={styles.btnSimularText}>⚡ Simular Recarga</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnManual}>
              <Text style={styles.btnManualText}>⌨ Inserir código manualmente</Text>
            </TouchableOpacity>

            {/* Estações próximas */}
            <Text style={styles.proximasLabel}>ESTAÇÕES PRÓXIMAS</Text>
            {[
              { nome: 'Eletroposto Central', sub: '1,2km · 150kW · 3 vagas', cor: '#00FF87' },
              { nome: 'EV Station Plus',     sub: '3,1km · 50kW · 2 vagas',  cor: '#FFB800' },
            ].map((e, i) => (
              <View key={i} style={styles.proximaCard}>
                <View style={[styles.proximaDot, { backgroundColor: e.cor }]} />
                <View style={styles.proximaInfo}>
                  <Text style={styles.proximaNome}>{e.nome}</Text>
                  <Text style={styles.proximaSub}>{e.sub}</Text>
                </View>
                <TouchableOpacity style={styles.proximaBtn}>
                  <Text style={styles.proximaBtnText}>Ir</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Animated.View>
        )}

        {/* ABA Histórico */}
        {aba === 'historico' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {HISTORICO.map(h => (
              <View key={h.id} style={styles.historicoCard}>
                <View style={styles.historicoTop}>
                  <View style={styles.historicoIconWrap}>
                    <Text style={styles.historicoIcon}>⚡</Text>
                  </View>
                  <View style={styles.historicoInfo}>
                    <Text style={styles.historicoEstacao}>{h.estacao}</Text>
                    <Text style={styles.historicoData}>{h.data}</Text>
                  </View>
                  <Text style={styles.historicoCusto}>{h.custo}</Text>
                </View>
                <View style={styles.historicoBatRow}>
                  <Text style={styles.historicoBatLabel}>{h.batInicio}%</Text>
                  <View style={styles.historicoBatTrack}>
                    <View style={[styles.historicoBatInicio, { width: `${h.batInicio}%` as any }]} />
                    <View style={[styles.historicoBatGanho, { width: `${h.batFim - h.batInicio}%` as any }]} />
                  </View>
                  <Text style={[styles.historicoBatLabel, { color: '#00E5FF' }]}>{h.batFim}%</Text>
                </View>
                <View style={styles.historicoStats}>
                  {[
                    { val: `${h.kwh} kWh`, label: 'Energia' },
                    { val: h.duracao,       label: 'Duração' },
                    { val: `+${h.batFim - h.batInicio}%`, label: 'Ganho', color: '#00E5FF' },
                  ].map((s, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <View style={styles.historicoStatDivider} />}
                      <View style={styles.historicoStat}>
                        <Text style={[styles.historicoStatVal, s.color ? { color: s.color } : {}]}>{s.val}</Text>
                        <Text style={styles.historicoStatLabel}>{s.label}</Text>
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* ABA Status */}
        {aba === 'status' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.statsCard}>
              <Text style={styles.sectionLabel}>TOTAL ACUMULADO</Text>
              <View style={styles.statsGrid}>
                {[
                  { num: '24', unit: 'sessões', label: 'Total recargas' },
                  { num: '487', unit: 'kWh', label: 'Energia total' },
                  { num: '420', unit: 'km', label: 'km elétricos' },
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <View style={styles.statsDivider} />}
                    <View style={styles.statsItem}>
                      <Text style={styles.statsNum}>{s.num}</Text>
                      <Text style={styles.statsUnit}>{s.unit}</Text>
                      <Text style={styles.statsLabel}>{s.label}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <View style={[styles.statsCard, { borderColor: 'rgba(0,255,135,0.2)' }]}>
              <Text style={styles.sectionLabel}>ECONOMIA vs COMBUSTÍVEL</Text>
              <View style={styles.econRow}>
                <View style={styles.econItem}>
                  <Text style={styles.econLabel}>Gasto elétrico</Text>
                  <Text style={[styles.econVal, { color: '#00E5FF' }]}>R$ 1.247</Text>
                </View>
                <Text style={styles.econVs}>vs</Text>
                <View style={styles.econItem}>
                  <Text style={styles.econLabel}>Seria gasolina</Text>
                  <Text style={[styles.econVal, { color: '#FF3B5C' }]}>R$ 3.780</Text>
                </View>
              </View>
              <View style={styles.econSaving}>
                <Text style={styles.econSavingIcon}>🌱</Text>
                <Text style={styles.econSavingText}>
                  Você economizou <Text style={{ color: '#00FF87', fontWeight: '600' }}>R$ 2.533</Text> e evitou{' '}
                  <Text style={{ color: '#00FF87', fontWeight: '600' }}>84kg de CO₂</Text>
                </Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <Text style={styles.sectionLabel}>ESTAÇÃO FAVORITA</Text>
              <View style={styles.favRow}>
                <View style={styles.favIconWrap}>
                  <Text style={styles.favIcon}>⚡</Text>
                </View>
                <View style={styles.favInfo}>
                  <Text style={styles.favNome}>Eletroposto Central</Text>
                  <Text style={styles.favSub}>12 recargas · Av. Paulista, 1000</Text>
                </View>
                <Text style={styles.favCount}>50%</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  scroll: { flexGrow: 1, paddingHorizontal: 16 },

  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 },
  headerTitle:     { fontFamily: 'Syne-Bold', fontSize: 22, color: '#F0F4FF' },
  headerBadge:     { backgroundColor: 'rgba(0,229,255,0.1)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  headerBadgeText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#00E5FF' },

  abas:         { flexDirection: 'row', backgroundColor: '#111827', borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  aba:          { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  abaActive:    { backgroundColor: '#00E5FF' },
  abaText:      { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.5)' },
  abaTextActive:{ fontFamily: 'Syne-Bold', fontSize: 12, color: '#000' },

  qrArea:   { alignItems: 'center' },
  qrTitle:  { fontFamily: 'Syne-Bold', fontSize: 20, color: '#F0F4FF', marginBottom: 8, alignSelf: 'flex-start' },
  qrSub:    { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)', marginBottom: 20, alignSelf: 'flex-start', lineHeight: 20 },
  qrScanner:{ width: 260, height: 260, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', marginBottom: 16 },

  btnSimular:     { width: '100%', height: 54, backgroundColor: '#00E5FF', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10, shadowColor: '#00E5FF', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  btnSimularText: { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  btnManual:      { width: '100%', height: 48, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  btnManualText:  { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.6)' },

  proximasLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 10, alignSelf: 'flex-start' },
  proximaCard:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 12, marginBottom: 8, width: '100%' },
  proximaDot:    { width: 10, height: 10, borderRadius: 5 },
  proximaInfo:   { flex: 1 },
  proximaNome:   { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#F0F4FF' },
  proximaSub:    { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  proximaBtn:    { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#00E5FF', borderRadius: 8 },
  proximaBtnText:{ fontFamily: 'Syne-Bold', fontSize: 13, color: '#000' },

  historicoCard:     { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 18, padding: 16, marginBottom: 10 },
  historicoTop:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  historicoIconWrap: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  historicoIcon:     { fontSize: 18 },
  historicoInfo:     { flex: 1 },
  historicoEstacao:  { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  historicoData:     { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  historicoCusto:    { fontFamily: 'Syne-Bold', fontSize: 15, color: '#00E5FF' },
  historicoBatRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  historicoBatLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.4)', width: 28 },
  historicoBatTrack: { flex: 1, height: 6, backgroundColor: '#1A2236', borderRadius: 3, overflow: 'hidden', flexDirection: 'row' },
  historicoBatInicio:{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)' },
  historicoBatGanho: { height: 6, backgroundColor: '#00E5FF' },
  historicoStats:       { flexDirection: 'row', backgroundColor: '#0D1320', borderRadius: 12, padding: 10 },
  historicoStat:        { flex: 1, alignItems: 'center' },
  historicoStatVal:     { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  historicoStatLabel:   { fontFamily: 'DMSans-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', marginTop: 2 },
  historicoStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)' },

  sectionLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 14 },
  statsCard:    { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 16, marginBottom: 12 },
  statsGrid:    { flexDirection: 'row' },
  statsItem:    { flex: 1, alignItems: 'center' },
  statsNum:     { fontFamily: 'Syne-Bold', fontSize: 28, color: '#F0F4FF', letterSpacing: -0.5 },
  statsUnit:    { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#00E5FF', marginTop: 2 },
  statsLabel:   { fontFamily: 'DMSans-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', marginTop: 4, textAlign: 'center' },
  statsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)' },

  econRow:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  econItem:       { flex: 1, alignItems: 'center' },
  econLabel:      { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)', marginBottom: 4 },
  econVal:        { fontFamily: 'Syne-Bold', fontSize: 22, letterSpacing: -0.5 },
  econVs:         { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.2)' },
  econSaving:     { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(0,255,135,0.06)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(0,255,135,0.15)' },
  econSavingIcon: { fontSize: 16 },
  econSavingText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.6)', lineHeight: 20 },

  favRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  favIconWrap:{ width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  favIcon:    { fontSize: 20 },
  favInfo:    { flex: 1 },
  favNome:    { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  favSub:     { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  favCount:   { fontFamily: 'Syne-Bold', fontSize: 20, color: '#00E5FF' },
});
