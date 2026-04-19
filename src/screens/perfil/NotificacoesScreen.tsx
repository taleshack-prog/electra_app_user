import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Notif {
  id: string; titulo: string; desc: string;
  ativo: boolean; grupo: string;
}

const NOTIFS_INICIAL: Notif[] = [
  // Bateria
  { id:'1', titulo:'Alerta de bateria baixa',     desc:'Avisa quando bateria atingir o limite configurado', ativo:true,  grupo:'Bateria' },
  { id:'2', titulo:'Bateria crítica (≤10%)',       desc:'Alerta urgente quando bateria estiver crítica',     ativo:true,  grupo:'Bateria' },
  { id:'3', titulo:'Recarga concluída',            desc:'Avisa quando o veículo atingir a meta de carga',    ativo:true,  grupo:'Bateria' },
  // Resgate
  { id:'4', titulo:'Resgatista a caminho',         desc:'Atualizações em tempo real do resgate SOS',         ativo:true,  grupo:'Resgate' },
  { id:'5', titulo:'Resgatista chegando',          desc:'Avisa quando o resgatista estiver próximo',          ativo:true,  grupo:'Resgate' },
  { id:'6', titulo:'Chamado expirado',             desc:'Avisa se nenhum resgatista aceitar o chamado',      ativo:false, grupo:'Resgate' },
  // Estações
  { id:'7', titulo:'Estação favorita disponível',  desc:'Avisa quando sua estação favorita ficar livre',     ativo:true,  grupo:'Estações' },
  { id:'8', titulo:'Novas estações próximas',      desc:'Informa sobre novas estações na sua região',        ativo:false, grupo:'Estações' },
  { id:'9', titulo:'Promoções de recarga',         desc:'Descontos e ofertas especiais em estações parceiras',ativo:true, grupo:'Estações' },
  // Gamificação
  { id:'10', titulo:'Nova conquista desbloqueada', desc:'Avisa quando você ganhar um badge ou conquista',    ativo:true,  grupo:'Gamificação' },
  { id:'11', titulo:'Subida no ranking',           desc:'Avisa quando você subir de posição no ranking',     ativo:false, grupo:'Gamificação' },
  { id:'12', titulo:'Pontos expirando',            desc:'Avisa 7 dias antes dos pontos expirarem',           ativo:true,  grupo:'Gamificação' },
  // Sistema
  { id:'13', titulo:'Atualizações do app',         desc:'Novas funcionalidades e melhorias disponíveis',     ativo:true,  grupo:'Sistema' },
  { id:'14', titulo:'Newsletter ELECTRA',          desc:'Novidades sobre mobilidade elétrica',               ativo:false, grupo:'Sistema' },
];

export default function NotificacoesScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [notifs, setNotifs] = useState<Notif[]>(NOTIFS_INICIAL);
  const [silencioso, setSilencioso] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const toggle = (id: string) =>
    setNotifs(n => n.map(x => x.id === id ? { ...x, ativo: !x.ativo } : x));

  const toggleGrupo = (grupo: string, valor: boolean) =>
    setNotifs(n => n.map(x => x.grupo === grupo ? { ...x, ativo: valor } : x));

  const grupos = [...new Set(notifs.map(n => n.grupo))];

  const grupoIcon: Record<string, string> = {
    'Bateria': '🔋', 'Resgate': '🆘', 'Estações': '⚡', 'Gamificação': '🏆', 'Sistema': '⚙',
  };

  const grupoAtivo = (grupo: string) => notifs.filter(n => n.grupo === grupo).every(n => n.ativo);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Notificações</Text>
          <View style={{width:36}} />
        </Animated.View>

        {/* Modo silencioso */}
        <Animated.View style={[s.silenciosoCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <View style={{flex:1}}>
            <Text style={s.silenciosoTitle}>🔕 Modo silencioso</Text>
            <Text style={s.silenciosoSub}>Desativa todas as notificações temporariamente</Text>
          </View>
          <Switch
            value={silencioso}
            onValueChange={setSilencioso}
            trackColor={{ false:'#1A2236', true:'rgba(255,59,92,0.4)' }}
            thumbColor={silencioso ? '#FF3B5C' : '#4A5568'}
          />
        </Animated.View>

        {/* Grupos */}
        {grupos.map(grupo => (
          <Animated.View key={grupo} style={[s.grupoSection, { opacity:fadeAnim }]}>
            <View style={s.grupoHeader}>
              <View style={s.grupoTitleRow}>
                <Text style={s.grupoIcon}>{grupoIcon[grupo]}</Text>
                <Text style={s.grupoTitle}>{grupo}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleGrupo(grupo, !grupoAtivo(grupo))}>
                <Text style={[s.grupoToggle, { color: grupoAtivo(grupo) ? '#00E5FF' : 'rgba(240,244,255,0.3)' }]}>
                  {grupoAtivo(grupo) ? 'Desativar todos' : 'Ativar todos'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={s.grupoCard}>
              {notifs.filter(n => n.grupo === grupo).map((n, i, arr) => (
                <View key={n.id}>
                  <View style={s.notifItem}>
                    <View style={{flex:1}}>
                      <Text style={[s.notifTitulo, !n.ativo && s.notifDesativo]}>{n.titulo}</Text>
                      <Text style={s.notifDesc}>{n.desc}</Text>
                    </View>
                    <Switch
                      value={n.ativo && !silencioso}
                      onValueChange={() => toggle(n.id)}
                      disabled={silencioso}
                      trackColor={{ false:'#1A2236', true:'rgba(0,229,255,0.4)' }}
                      thumbColor={n.ativo && !silencioso ? '#00E5FF' : '#4A5568'}
                    />
                  </View>
                  {i < arr.length - 1 && <View style={s.divider} />}
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Stats */}
        <Animated.View style={[s.statsCard, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>RESUMO</Text>
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statNum}>{notifs.filter(n => n.ativo).length}</Text>
              <Text style={s.statLabel}>Ativas</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={[s.statNum, {color:'rgba(240,244,255,0.3)'}]}>{notifs.filter(n => !n.ativo).length}</Text>
              <Text style={s.statLabel}>Inativas</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={[s.statNum, {color:'#00E5FF'}]}>{notifs.length}</Text>
              <Text style={s.statLabel}>Total</Text>
            </View>
          </View>
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

  silenciosoCard:{ flexDirection:'row', alignItems:'center', gap:12, backgroundColor:'rgba(255,59,92,0.06)', borderWidth:1, borderColor:'rgba(255,59,92,0.2)', borderRadius:16, padding:14, marginBottom:20 },
  silenciosoTitle:{ fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF', marginBottom:3 },
  silenciosoSub:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)' },

  grupoSection: { marginBottom:16 },
  grupoHeader:  { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  grupoTitleRow:{ flexDirection:'row', alignItems:'center', gap:6 },
  grupoIcon:    { fontSize:16 },
  grupoTitle:   { fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF' },
  grupoToggle:  { fontFamily:'DMSans-Regular', fontSize:12 },

  grupoCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden' },
  notifItem:  { flexDirection:'row', alignItems:'center', gap:12, padding:14 },
  notifTitulo:{ fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF', marginBottom:3 },
  notifDesativo:{ color:'rgba(240,244,255,0.35)' },
  notifDesc:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.35)', lineHeight:17 },
  divider:    { height:1, backgroundColor:'rgba(255,255,255,0.04)', marginLeft:14 },

  statsCard:   { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:16, marginBottom:8 },
  sectionLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:12 },
  statsRow:    { flexDirection:'row' },
  statItem:    { flex:1, alignItems:'center' },
  statNum:     { fontFamily:'Syne-Bold', fontSize:24, color:'#F0F4FF' },
  statLabel:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.35)', marginTop:2 },
  statDivider: { width:1, backgroundColor:'rgba(255,255,255,0.06)' },
});
