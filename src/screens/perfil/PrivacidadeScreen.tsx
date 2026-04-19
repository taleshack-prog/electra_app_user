import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Switch, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PrivacidadeScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [configs, setConfigs] = useState({
    compartilharLocalizacao: true,
    historicoViagem:         true,
    dadosAnonimos:           true,
    cookiesMarketing:        false,
    perfilPublico:           false,
    rankingPublico:          true,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const toggle = (key: keyof typeof configs) =>
    setConfigs(c => ({ ...c, [key]: !c[key] }));

  const handleExcluirDados = () => {
    Alert.alert(
      'Excluir meus dados',
      'Esta ação é irreversível. Todos os seus dados serão removidos permanentemente dentro de 30 dias, conforme a LGPD.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Solicitar exclusão', style: 'destructive', onPress: () =>
          Alert.alert('Solicitação enviada', 'Você receberá um e-mail de confirmação em até 24 horas.')
        },
      ]
    );
  };

  const handleBaixarDados = () => {
    Alert.alert('Exportar dados', 'Seus dados serão preparados e enviados para seu e-mail em até 48 horas, conforme a LGPD Art. 18.');
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Privacidade</Text>
          <View style={{width:36}} />
        </Animated.View>

        {/* LGPD Badge */}
        <Animated.View style={[s.lgpdCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <Text style={s.lgpdIcon}>🛡</Text>
          <View style={{flex:1}}>
            <Text style={s.lgpdTitle}>Conformidade LGPD</Text>
            <Text style={s.lgpdSub}>
              A ELECTRA respeita a Lei Geral de Proteção de Dados (Lei 13.709/2018). Você tem controle total sobre seus dados.
            </Text>
          </View>
        </Animated.View>

        {/* Localização */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>📍 LOCALIZAÇÃO</Text>
          <View style={s.card}>
            <View style={s.item}>
              <View style={{flex:1}}>
                <Text style={s.itemTitle}>Compartilhar localização</Text>
                <Text style={s.itemDesc}>Necessário para encontrar estações e enviar resgates</Text>
              </View>
              <Switch value={configs.compartilharLocalizacao} onValueChange={() => toggle('compartilharLocalizacao')}
                trackColor={{false:'#1A2236', true:'rgba(0,229,255,0.4)'}} thumbColor={configs.compartilharLocalizacao?'#00E5FF':'#4A5568'} />
            </View>
            <View style={s.divider} />
            <View style={s.item}>
              <View style={{flex:1}}>
                <Text style={s.itemTitle}>Histórico de viagens</Text>
                <Text style={s.itemDesc}>Salva seus trajetos para melhorar sugestões de rotas</Text>
              </View>
              <Switch value={configs.historicoViagem} onValueChange={() => toggle('historicoViagem')}
                trackColor={{false:'#1A2236', true:'rgba(0,229,255,0.4)'}} thumbColor={configs.historicoViagem?'#00E5FF':'#4A5568'} />
            </View>
          </View>
        </Animated.View>

        {/* Dados */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>📊 DADOS E ANALYTICS</Text>
          <View style={s.card}>
            <View style={s.item}>
              <View style={{flex:1}}>
                <Text style={s.itemTitle}>Dados anônimos de uso</Text>
                <Text style={s.itemDesc}>Ajuda a melhorar o app sem identificar você</Text>
              </View>
              <Switch value={configs.dadosAnonimos} onValueChange={() => toggle('dadosAnonimos')}
                trackColor={{false:'#1A2236', true:'rgba(0,229,255,0.4)'}} thumbColor={configs.dadosAnonimos?'#00E5FF':'#4A5568'} />
            </View>
            <View style={s.divider} />
            <View style={s.item}>
              <View style={{flex:1}}>
                <Text style={s.itemTitle}>Cookies de marketing</Text>
                <Text style={s.itemDesc}>Personaliza ofertas e anúncios relevantes</Text>
              </View>
              <Switch value={configs.cookiesMarketing} onValueChange={() => toggle('cookiesMarketing')}
                trackColor={{false:'#1A2236', true:'rgba(0,229,255,0.4)'}} thumbColor={configs.cookiesMarketing?'#00E5FF':'#4A5568'} />
            </View>
          </View>
        </Animated.View>

        {/* Perfil público */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>👤 VISIBILIDADE</Text>
          <View style={s.card}>
            <View style={s.item}>
              <View style={{flex:1}}>
                <Text style={s.itemTitle}>Perfil público</Text>
                <Text style={s.itemDesc}>Outros usuários podem ver seu perfil e conquistas</Text>
              </View>
              <Switch value={configs.perfilPublico} onValueChange={() => toggle('perfilPublico')}
                trackColor={{false:'#1A2236', true:'rgba(0,229,255,0.4)'}} thumbColor={configs.perfilPublico?'#00E5FF':'#4A5568'} />
            </View>
            <View style={s.divider} />
            <View style={s.item}>
              <View style={{flex:1}}>
                <Text style={s.itemTitle}>Aparecer no ranking</Text>
                <Text style={s.itemDesc}>Seu nome aparece no ranking global de usuários</Text>
              </View>
              <Switch value={configs.rankingPublico} onValueChange={() => toggle('rankingPublico')}
                trackColor={{false:'#1A2236', true:'rgba(0,229,255,0.4)'}} thumbColor={configs.rankingPublico?'#00E5FF':'#4A5568'} />
            </View>
          </View>
        </Animated.View>

        {/* Direitos LGPD */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>⚖ SEUS DIREITOS (LGPD)</Text>
          <View style={s.card}>
            {[
              { icon:'📥', title:'Baixar meus dados', desc:'Receba uma cópia completa dos seus dados em 48h', onPress: handleBaixarDados },
              { icon:'✏', title:'Corrigir dados incorretos', desc:'Solicite correção de informações imprecisas', onPress: () => navigation.goBack() },
              { icon:'🚫', title:'Revogar consentimentos', desc:'Retire permissões de uso dos seus dados', onPress: () => {} },
            ].map((item, i, arr) => (
              <View key={i}>
                <TouchableOpacity style={s.item} onPress={item.onPress} activeOpacity={0.7}>
                  <Text style={{fontSize:20, marginRight:10}}>{item.icon}</Text>
                  <View style={{flex:1}}>
                    <Text style={s.itemTitle}>{item.title}</Text>
                    <Text style={s.itemDesc}>{item.desc}</Text>
                  </View>
                  <Text style={{color:'rgba(240,244,255,0.2)', fontSize:18}}>›</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={s.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Excluir conta */}
        <Animated.View style={[s.deleteCard, { opacity:fadeAnim }]}>
          <Text style={s.deleteIcon}>🗑</Text>
          <View style={{flex:1}}>
            <Text style={s.deleteTitle}>Excluir minha conta</Text>
            <Text style={s.deleteSub}>Remove todos os dados permanentemente (LGPD Art. 18, VI)</Text>
          </View>
          <TouchableOpacity style={s.deleteBtn} onPress={handleExcluirDados}>
            <Text style={s.deleteBtnText}>Solicitar</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* DPO */}
        <Animated.View style={[s.dpoCard, { opacity:fadeAnim }]}>
          <Text style={s.dpoText}>
            Encarregado de Proteção de Dados (DPO): privacidade@electra.com.br {'\n'}
            Atendimento: seg-sex, 9h-18h
          </Text>
        </Animated.View>

        <View style={{height:40}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16 },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:16, marginBottom:20 },
  backBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'#1A2236', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },
  backArrow:{ fontSize:18, color:'rgba(240,244,255,0.6)' },
  headerTitle:{ fontFamily:'Syne-Bold', fontSize:17, color:'#F0F4FF' },

  lgpdCard:  { flexDirection:'row', alignItems:'flex-start', gap:12, backgroundColor:'rgba(0,229,255,0.06)', borderWidth:1, borderColor:'rgba(0,229,255,0.2)', borderRadius:16, padding:14, marginBottom:20 },
  lgpdIcon:  { fontSize:24 },
  lgpdTitle: { fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF', marginBottom:4 },
  lgpdSub:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.5)', lineHeight:18 },

  section:      { marginBottom:16 },
  sectionLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:10 },
  card:         { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden' },
  item:         { flexDirection:'row', alignItems:'center', padding:14, gap:8 },
  itemTitle:    { fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF', marginBottom:3 },
  itemDesc:     { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', lineHeight:17 },
  divider:      { height:1, backgroundColor:'rgba(255,255,255,0.04)', marginLeft:14 },

  deleteCard:  { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'rgba(255,59,92,0.06)', borderWidth:1, borderColor:'rgba(255,59,92,0.2)', borderRadius:16, padding:14, marginBottom:12 },
  deleteIcon:  { fontSize:20 },
  deleteTitle: { fontFamily:'Syne-Bold', fontSize:14, color:'#FF3B5C' },
  deleteSub:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)', marginTop:2, lineHeight:16 },
  deleteBtn:   { paddingHorizontal:12, paddingVertical:7, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1, borderColor:'rgba(255,59,92,0.3)', borderRadius:8 },
  deleteBtnText:{ fontFamily:'Syne-Bold', fontSize:12, color:'#FF3B5C' },

  dpoCard:  { backgroundColor:'#111827', borderRadius:12, padding:14, marginBottom:8 },
  dpoText:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.3)', lineHeight:20, textAlign:'center' },
});
