import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

export default function CadastroScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [nome, setNome]   = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel]     = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisible, setSenhaVisible] = useState(false);
  const [termos, setTermos] = useState(false);

  const [nomeFocused,  setNomeFocused]  = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [telFocused,   setTelFocused]   = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Força da senha
  const senhaForce = () => {
    if (senha.length === 0) return 0;
    let score = 0;
    if (senha.length >= 8) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;
    return score;
  };

  const forceLabel = ['', 'Fraca', 'Média', 'Boa', 'Forte'];
  const forceColor = ['', '#FF3B5C', '#FFB800', '#00E5FF', '#00FF87'];
  const force = senhaForce();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          <Text style={styles.headerTitle}>Criar conta</Text>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* Título */}
        <Animated.View style={[styles.titleArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Bem-vindo ao{'\n'}<Text style={styles.titleCyan}>ELECTRA Rescue</Text></Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo para começar</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>

          {/* Nome */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>NOME COMPLETO</Text>
            <View style={[styles.inputBox, nomeFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="João Silva"
                placeholderTextColor="rgba(240,244,255,0.2)"
                value={nome}
                onChangeText={setNome}
                onFocus={() => setNomeFocused(true)}
                onBlur={() => setNomeFocused(false)}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>E-MAIL</Text>
            <View style={[styles.inputBox, emailFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="rgba(240,244,255,0.2)"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Telefone */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>TELEFONE</Text>
            <View style={[styles.inputBox, telFocused && styles.inputFocused]}>
              <Text style={styles.flagText}>🇧🇷</Text>
              <View style={styles.flagDivider} />
              <TextInput
                style={styles.input}
                placeholder="+55 (11) 99999-9999"
                placeholderTextColor="rgba(240,244,255,0.2)"
                value={tel}
                onChangeText={setTel}
                onFocus={() => setTelFocused(true)}
                onBlur={() => setTelFocused(false)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>SENHA</Text>
            <View style={[styles.inputBox, senhaFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="rgba(240,244,255,0.2)"
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setSenhaFocused(true)}
                onBlur={() => setSenhaFocused(false)}
                secureTextEntry={!senhaVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSenhaVisible(v => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.inputIcon}>{senhaVisible ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>

            {/* Barra de força */}
            {senha.length > 0 && (
              <View style={styles.forceWrap}>
                <View style={styles.forceBars}>
                  {[1, 2, 3, 4].map(i => (
                    <View
                      key={i}
                      style={[
                        styles.forceBar,
                        { backgroundColor: i <= force ? forceColor[force] : 'rgba(255,255,255,0.08)' },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.forceLabel, { color: forceColor[force] }]}>
                  {forceLabel[force]}
                </Text>
              </View>
            )}
          </View>

          {/* Termos */}
          <TouchableOpacity style={styles.termosRow} onPress={() => setTermos(t => !t)}>
            <View style={[styles.checkbox, termos && styles.checkboxActive]}>
              {termos && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termosText}>
              Li e aceito os{' '}
              <Text style={styles.termosLink}>Termos de Uso</Text>
              {' '}e a{' '}
              <Text style={styles.termosLink}>Política de Privacidade</Text>
            </Text>
          </TouchableOpacity>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.btnPrimary, !termos && styles.btnDisabled]}
            activeOpacity={termos ? 0.85 : 1}
            onPress={() => termos && navigation.navigate('SetupVeiculo')}
          >
            <Text style={styles.btnText}>Criar minha conta</Text>
            <Text style={styles.btnArrow}>→</Text>
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 24 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A2236', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { fontSize: 18, color: 'rgba(240,244,255,0.6)' },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },

  titleArea: { marginBottom: 28 },
  title:     { fontFamily: 'Syne-Bold', fontSize: 26, color: '#F0F4FF', lineHeight: 34, marginBottom: 8, letterSpacing: -0.5 },
  titleCyan: { color: '#00E5FF' },
  subtitle:  { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.4)' },

  form: { flex: 1 },

  inputWrap:    { marginBottom: 14 },
  inputLabel:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 7 },
  inputBox:     { flexDirection: 'row', alignItems: 'center', height: 52, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14 },
  inputFocused: { borderColor: '#00E5FF' },
  inputIcon:    { fontSize: 14, marginRight: 10, color: 'rgba(240,244,255,0.4)' },
  input:        { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: '#F0F4FF', paddingVertical: 0 },
  flagText:     { fontSize: 18, marginRight: 8 },
  flagDivider:  { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 10 },

  forceWrap:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  forceBars:  { flexDirection: 'row', gap: 4, flex: 1 },
  forceBar:   { flex: 1, height: 3, borderRadius: 2 },
  forceLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1 },

  termosRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 24 },
  checkbox:     { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: 'rgba(0,229,255,0.15)', borderColor: '#00E5FF' },
  checkmark:    { fontSize: 12, color: '#00E5FF', fontWeight: 'bold' },
  termosText:   { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.4)', lineHeight: 20 },
  termosLink:   { color: '#00E5FF' },

  btnPrimary:  { height: 54, backgroundColor: '#00E5FF', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20, shadowColor: '#00E5FF', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  btnDisabled: { opacity: 0.4 },
  btnText:     { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  btnArrow:    { fontFamily: 'Syne-Bold', fontSize: 16, color: '#000' },

  loginRow:  { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.4)' },
  loginLink: { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#00E5FF', fontWeight: '600' },
});
