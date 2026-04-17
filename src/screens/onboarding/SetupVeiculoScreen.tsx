import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, StatusBar, ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const MARCAS = [
  'BYD Seal 03', 'BYD Atto 03', 'BYD Dolphin',
  'BMW iX', 'BMW i4', 'Volvo EX30', 'Volvo C40',
  'Tesla Model 3', 'Tesla Model Y',
  'Fiat 500e', 'Chevrolet Bolt', 'Renault Kwid E-Tech',
  'GWM Ora 03', 'JAC E-JS1', 'Outro',
];

interface Veiculo {
  id: string;
  modelo: string;
  placa: string;
  apelido: string;
}

export default function SetupVeiculoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [modelo, setModelo]     = useState('');
  const [placa, setPlaca]       = useState('');
  const [apelido, setApelido]   = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [modeloFiltro, setModeloFiltro] = useState('');
  const [placaFocused, setPlacaFocused]   = useState(false);
  const [apelidoFocused, setApelidoFocused] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const marcasFiltradas = MARCAS.filter(m =>
    m.toLowerCase().includes(modeloFiltro.toLowerCase())
  );

  const adicionarVeiculo = () => {
    if (!modelo || !placa) return;
    const novo: Veiculo = {
      id: Date.now().toString(),
      modelo,
      placa: placa.toUpperCase(),
      apelido: apelido || modelo,
    };
    setVeiculos(v => [...v, novo]);
    setModelo('');
    setPlaca('');
    setApelido('');
    setModeloFiltro('');
  };

  const removerVeiculo = (id: string) => {
    setVeiculos(v => v.filter(x => x.id !== id));
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seus veículos</Text>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* Progress */}
        <Animated.View style={[styles.progressArea, { opacity: fadeAnim }]}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Passo 1 de 2</Text>
            <Text style={styles.progressPct}>50%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressSub}>
            Adicione um ou mais veículos elétricos
          </Text>
        </Animated.View>

        {/* Veículos adicionados */}
        {veiculos.length > 0 && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <Text style={styles.sectionLabel}>ADICIONADOS ({veiculos.length})</Text>
            {veiculos.map(v => (
              <View key={v.id} style={styles.veiculoCard}>
                <View style={styles.veiculoIcon}>
                  <Text style={styles.veiculoIconText}>🚗</Text>
                </View>
                <View style={styles.veiculoInfo}>
                  <Text style={styles.veiculoApelido}>{v.apelido}</Text>
                  <Text style={styles.veiculoSub}>{v.modelo} · {v.placa}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removerVeiculo(v.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Formulário novo veículo */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionLabel}>
            {veiculos.length === 0 ? 'SEU VEÍCULO' : 'ADICIONAR OUTRO'}
          </Text>

          {/* Modelo */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>MODELO</Text>
            <TouchableOpacity
              style={[styles.inputBox, showDropdown && styles.inputFocused]}
              onPress={() => setShowDropdown(s => !s)}
              activeOpacity={0.8}
            >
              <Text style={styles.inputIcon}>🚗</Text>
              <Text style={[styles.inputText, !modelo && styles.placeholder]}>
                {modelo || 'Selecione o modelo'}
              </Text>
              <Text style={styles.chevron}>{showDropdown ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {/* Dropdown */}
            {showDropdown && (
              <View style={styles.dropdown}>
                <TextInput
                  style={styles.dropdownSearch}
                  placeholder="Buscar modelo..."
                  placeholderTextColor="rgba(240,244,255,0.2)"
                  value={modeloFiltro}
                  onChangeText={setModeloFiltro}
                  autoFocus
                />
                <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {marcasFiltradas.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.dropdownItem, modelo === m && styles.dropdownItemActive]}
                      onPress={() => { setModelo(m); setShowDropdown(false); setModeloFiltro(''); }}
                    >
                      <Text style={[styles.dropdownItemText, modelo === m && styles.dropdownItemTextActive]}>
                        {m}
                      </Text>
                      {modelo === m && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Placa */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>PLACA</Text>
            <View style={[styles.inputBox, placaFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>🔢</Text>
              <TextInput
                style={styles.input}
                placeholder="ABC-1234 ou ABC1D23"
                placeholderTextColor="rgba(240,244,255,0.2)"
                value={placa}
                onChangeText={setPlaca}
                onFocus={() => setPlacaFocused(true)}
                onBlur={() => setPlacaFocused(false)}
                autoCapitalize="characters"
                maxLength={8}
              />
            </View>
          </View>

          {/* Apelido */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>APELIDO (opcional)</Text>
            <View style={[styles.inputBox, apelidoFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>✏</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Meu BYD, Carro da empresa..."
                placeholderTextColor="rgba(240,244,255,0.2)"
                value={apelido}
                onChangeText={setApelido}
                onFocus={() => setApelidoFocused(true)}
                onBlur={() => setApelidoFocused(false)}
              />
            </View>
          </View>

          {/* Adicionar veículo */}
          {veiculos.length > 0 && (
            <TouchableOpacity
              style={[styles.btnSecondary, (!modelo || !placa) && styles.btnDisabled]}
              onPress={adicionarVeiculo}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>+ Adicionar veículo</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Frota info */}
        <Animated.View style={[styles.infoBox, { opacity: fadeAnim }]}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Você pode adicionar múltiplos veículos — perfeito para frotas ou família.
          </Text>
        </Animated.View>

        {/* CTA principal */}
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <TouchableOpacity
            style={[styles.btnPrimary, (!modelo || !placa) && veiculos.length === 0 && styles.btnDisabled]}
            activeOpacity={0.85}
            onPress={() => {
              if (modelo && placa) adicionarVeiculo();
              navigation.replace('MainTabs');
            }}
          >
            <Text style={styles.btnText}>
              {veiculos.length > 0 ? 'Próximo' : 'Adicionar e continuar'}
            </Text>
            <Text style={styles.btnArrow}>→</Text>
          </TouchableOpacity>

          {veiculos.length > 0 && (
            <TouchableOpacity
              style={styles.btnSkip}
              onPress={() => navigation.replace('MainTabs')}
            >
              <Text style={styles.btnSkipText}>Continuar sem adicionar outro</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { fontSize: 18, color: 'rgba(240,244,255,0.6)' },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },

  progressArea: { marginBottom: 24 },
  progressRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel:{ fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  progressPct:  { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, color: '#00E5FF' },
  progressTrack:{ height: 3, backgroundColor: '#1A2236', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 3, borderRadius: 2, backgroundColor: '#00E5FF' },
  progressSub:  { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.35)' },

  section:      { marginBottom: 20 },
  sectionLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 12 },

  veiculoCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, marginBottom: 8, gap: 12 },
  veiculoIcon:     { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  veiculoIconText: { fontSize: 18 },
  veiculoInfo:     { flex: 1 },
  veiculoApelido:  { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  veiculoSub:      { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)', marginTop: 2 },
  removeBtn:       { fontSize: 16, color: '#FF3B5C', padding: 4 },

  inputWrap:    { marginBottom: 14 },
  inputLabel:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 7 },
  inputBox:     { flexDirection: 'row', alignItems: 'center', height: 52, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14 },
  inputFocused: { borderColor: '#00E5FF' },
  inputIcon:    { fontSize: 14, marginRight: 10 },
  inputText:    { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: '#F0F4FF' },
  placeholder:  { color: 'rgba(240,244,255,0.2)' },
  chevron:      { fontSize: 12, color: 'rgba(240,244,255,0.4)' },
  input:        { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: '#F0F4FF', paddingVertical: 0 },
  checkmark:    { fontSize: 13, color: '#00E5FF' },

  dropdown:       { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', borderRadius: 12, marginTop: 4, maxHeight: 220, overflow: 'hidden' },
  dropdownSearch: { height: 44, paddingHorizontal: 14, fontFamily: 'DMSans-Regular', fontSize: 14, color: '#F0F4FF', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  dropdownList:   { maxHeight: 176 },
  dropdownItem:   { paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  dropdownItemActive:     { backgroundColor: 'rgba(0,229,255,0.08)' },
  dropdownItemText:       { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.7)' },
  dropdownItemTextActive: { color: '#00E5FF', fontWeight: '600' },

  infoBox:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(0,229,255,0.06)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.12)', borderRadius: 12, padding: 14, marginBottom: 20 },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.5)', lineHeight: 20 },

  btnPrimary:  { height: 54, backgroundColor: '#00E5FF', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, shadowColor: '#00E5FF', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  btnDisabled: { opacity: 0.4 },
  btnText:     { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  btnArrow:    { fontFamily: 'Syne-Bold', fontSize: 16, color: '#000' },

  btnSecondary:     { height: 48, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: 'rgba(0,229,255,0.3)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  btnSecondaryText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#00E5FF' },

  btnSkip:     { alignItems: 'center', paddingVertical: 10 },
  btnSkipText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.35)' },
});
