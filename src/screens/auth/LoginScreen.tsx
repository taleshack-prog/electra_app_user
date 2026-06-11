import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail]               = useState('');
  const [senha, setSenha]               = useState('');
  const [senhaVisible, setSenhaVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);
  const [loading, setLoading]           = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, senha);
    setLoading(false);
    if (error) {
      Alert.alert('Erro ao entrar', error.message);
    } else {
      navigation.replace('MainTabs');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.logoArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoCircle}>
            <View style={styles.boltTop} />
            <View style={styles.boltBottom} />
          </View>
          <Text style={styles.wordmark}>ELECTRA</Text>
          <Text style={styles.tag}>CHARGE</Text>
        </Animated.View>

        <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>

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
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>SENHA</Text>
            <View style={[styles.inputBox, senhaFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(240,244,255,0.2)"
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setSenhaFocused(true)}
                onBlur={() => setSenhaFocused(false)}
                secureTextEntry={!senhaVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSenhaVisible(v => !v)} hitSlop={{ top:10, bottom:10, left:10, right:10 }}>
                <Text style={styles.inputIcon}>{senhaVisible ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgot}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.btnPrimaryText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
            {!loading && <Text style={styles.btnArrow}>→</Text>}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.btnSocial}>
              <Text style={styles.btnSocialText}>G  Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSocial}>
              <Text style={styles.btnSocialText}>  Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.signupLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#070B14' },
  scroll:   { flexGrow: 1, paddingHorizontal: 24 },
  logoArea: { alignItems: 'center', paddingTop: 52, paddingBottom: 36 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,229,255,0.1)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  boltTop:    { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 3, borderBottomWidth: 16, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#00E5FF', marginBottom: -3, marginLeft: 5 },
  boltBottom: { width: 0, height: 0, borderLeftWidth: 3, borderRightWidth: 8, borderTopWidth: 16, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#00E5FF', marginRight: 5, opacity: 0.85 },
  wordmark: { fontFamily: 'Syne-Bold', fontSize: 26, color: '#F0F4FF', letterSpacing: -0.5 },
  tag:      { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#00E5FF', letterSpacing: 5, marginTop: 4 },
  form:     { flex: 1 },
  title:    { fontFamily: 'Syne-Bold', fontSize: 24, color: '#F0F4FF', marginBottom: 6 },
  subtitle: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.4)', marginBottom: 28 },
  inputWrap:    { marginBottom: 14 },
  inputLabel:   { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 7 },
  inputBox:     { flexDirection: 'row', alignItems: 'center', height: 52, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14 },
  inputFocused: { borderColor: '#00E5FF' },
  inputIcon:    { fontSize: 14, marginRight: 10, color: 'rgba(240,244,255,0.4)' },
  input:        { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: '#F0F4FF', paddingVertical: 0 },
  forgotWrap: { alignItems: 'flex-end', marginBottom: 24 },
  forgot:     { fontFamily: 'DMSans-Regular', fontSize: 13, color: '#00E5FF' },
  btnPrimary:     { height: 54, backgroundColor: '#00E5FF', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20, shadowColor: '#00E5FF', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  btnPrimaryText: { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  btnArrow:       { fontFamily: 'Syne-Bold', fontSize: 16, color: '#000' },
  btnDisabled:    { opacity: 0.6 },
  divider:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  dividerText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.2)' },
  socialRow:     { flexDirection: 'row', gap: 10, marginBottom: 32 },
  btnSocial:     { flex: 1, height: 48, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnSocialText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.6)' },
  signupRow:  { flexDirection: 'row', justifyContent: 'center', paddingBottom: 32 },
  signupText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(240,244,255,0.4)' },
  signupLink: { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#00E5FF', fontWeight: '600' },
});
