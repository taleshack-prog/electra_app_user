import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Animated, Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');

interface Estacao {
  id: string;
  nome: string;
  end: string;
  dist: string;
  potencia: string;
  tipo: string;
  status: string;
  preco: string;
  rating: number;
  vagas: number;
  lat: number;
  lng: number;
}

const CONECTORES = [
  { tipo: 'CCS2', potencia: '150kW', preco: 'R$ 3,20/kWh', disponivel: true,  cor: '#00FF87' },
  { tipo: 'CHAdeMO', potencia: '50kW', preco: 'R$ 2,80/kWh', disponivel: true,  cor: '#00FF87' },
  { tipo: 'Type 2', potencia: '22kW',  preco: 'R$ 2,10/kWh', disponivel: false, cor: '#FF3B5C' },
];

const REVIEWS = [
  { user: 'João S.',   nota: 5, texto: 'Carregamento rápido, local seguro e bem iluminado.', data: 'há 2 dias' },
  { user: 'Marina C.', nota: 5, texto: 'Melhor estação da região. Sempre disponível!',       data: 'há 5 dias' },
  { user: 'Pedro L.',  nota: 4, texto: 'Boa estrutura, só falta um café por perto.',          data: 'há 1 semana' },
];

const AMENIDADES = ['🅿️ Estacionamento', '🔒 Segurança 24h', '📶 Wi-Fi', '🚻 Banheiros', '♿ Acessível'];

export default function StationDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<any>();
  const estacao: Estacao = route.params?.estacao ?? {
    id: '1', nome: 'Eletroposto Central', end: 'Av. Paulista, 1000',
    dist: '1,2km', potencia: '150kW', tipo: 'DC', status: 'livre',
    preco: 'R$ 3,20/kWh', rating: 4.8, vagas: 3, lat: -23.5614, lng: -46.6560,
  };

  const [conectorSelecionado, setConectorSelecionado] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const conector = CONECTORES[conectorSelecionado];
  const disponivel = estacao.status === 'livre';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhes</Text>
        <TouchableOpacity style={s.backBtn}>
          <Text style={s.backIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Hero card */}
          <View style={s.heroCard}>
            <View style={s.heroTop}>
              <View style={[s.statusBadge, { backgroundColor: disponivel ? 'rgba(0,255,135,0.15)' : 'rgba(255,59,92,0.15)' }]}>
                <View style={[s.statusDot, { backgroundColor: disponivel ? '#00FF87' : '#FF3B5C' }]} />
                <Text style={[s.statusText, { color: disponivel ? '#00FF87' : '#FF3B5C' }]}>
                  {disponivel ? `${estacao.vagas} vagas livres` : 'Ocupado'}
                </Text>
              </View>
              <View style={s.ratingWrap}>
                <Text style={s.ratingStar}>★</Text>
                <Text style={s.ratingVal}>{estacao.rating}</Text>
                <Text style={s.ratingCount}>({REVIEWS.length})</Text>
              </View>
            </View>

            <Text style={s.heroNome}>{estacao.nome}</Text>
            <Text style={s.heroEnd}>📍 {estacao.end}</Text>

            {/* Stats */}
            <View style={s.statsRow}>
              {[
                { icon: '📍', val: estacao.dist,     label: 'Distância' },
                { icon: '⚡', val: estacao.potencia, label: 'Potência' },
                { icon: '🕐', val: '24h',            label: 'Horário' },
              ].map((st, i) => (
                <View key={i} style={s.statItem}>
                  <Text style={s.statIcon}>{st.icon}</Text>
                  <Text style={s.statVal}>{st.val}</Text>
                  <Text style={s.statLabel}>{st.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Conectores */}
          <Text style={s.sectionLabel}>CONECTORES DISPONÍVEIS</Text>
          <View style={s.conectoresWrap}>
            {CONECTORES.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={[s.conectorCard, conectorSelecionado === i && s.conectorCardActive, !c.disponivel && s.conectorCardOff]}
                onPress={() => c.disponivel && setConectorSelecionado(i)}
                activeOpacity={c.disponivel ? 0.8 : 1}
              >
                <View style={s.conectorTop}>
                  <Text style={[s.conectorTipo, !c.disponivel && s.textOff]}>{c.tipo}</Text>
                  <View style={[s.conectorDot, { backgroundColor: c.cor }]} />
                </View>
                <Text style={[s.conectorPot, !c.disponivel && s.textOff]}>{c.potencia}</Text>
                <Text style={[s.conectorPreco, !c.disponivel && s.textOff]}>{c.preco}</Text>
                {!c.disponivel && <Text style={s.conectorOccupied}>Ocupado</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Amenidades */}
          <Text style={s.sectionLabel}>AMENIDADES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.amenRow}>
            {AMENIDADES.map((a, i) => (
              <View key={i} style={s.amenChip}>
                <Text style={s.amenText}>{a}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Reviews */}
          <Text style={[s.sectionLabel, { marginTop: 20 }]}>AVALIAÇÕES</Text>
          {REVIEWS.map((r, i) => (
            <View key={i} style={s.reviewCard}>
              <View style={s.reviewTop}>
                <View style={s.reviewAvatar}>
                  <Text style={s.reviewAvatarText}>{r.user[0]}</Text>
                </View>
                <View style={s.reviewInfo}>
                  <Text style={s.reviewUser}>{r.user}</Text>
                  <Text style={s.reviewData}>{r.data}</Text>
                </View>
                <Text style={s.reviewNota}>{'★'.repeat(r.nota)}</Text>
              </View>
              <Text style={s.reviewTexto}>{r.texto}</Text>
            </View>
          ))}

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        <View style={s.precoWrap}>
          <Text style={s.precoLabel}>Conector selecionado</Text>
          <Text style={s.precoVal}>{conector.tipo} · {conector.potencia}</Text>
        </View>
        <TouchableOpacity
          style={[s.ctaBtn, !disponivel && s.ctaBtnOff]}
          activeOpacity={0.85}
          onPress={() => {
            if (!disponivel) return;
            navigation.navigate('CheckoutRecarga', {
              estacao: estacao.nome,
              conector: conector.tipo,
              potencia: conector.potencia,
              preco: conector.preco,
            } as any);
          }}
        >
          <Text style={[s.ctaText, !disponivel && s.ctaTextOff]}>
            {disponivel ? '⚡ Iniciar Recarga' : 'Estação Ocupada'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
  backBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backIcon:    { fontSize: 18, color: '#F0F4FF' },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 17, color: '#F0F4FF' },

  heroCard:    { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 16, marginBottom: 20 },
  heroTop:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  statusText:  { fontFamily: 'Syne-Bold', fontSize: 12 },
  ratingWrap:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingStar:  { color: '#FFB800', fontSize: 14 },
  ratingVal:   { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  ratingCount: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.4)' },

  heroNome: { fontFamily: 'Syne-Bold', fontSize: 20, color: '#F0F4FF', marginBottom: 4 },
  heroEnd:  { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.45)', marginBottom: 16 },

  statsRow:  { flexDirection: 'row', backgroundColor: '#0D1320', borderRadius: 14, padding: 12 },
  statItem:  { flex: 1, alignItems: 'center', gap: 3 },
  statIcon:  { fontSize: 16 },
  statVal:   { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF' },
  statLabel: { fontFamily: 'DMSans-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)' },

  sectionLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: 'rgba(240,244,255,0.35)', letterSpacing: 2, marginBottom: 10 },

  conectoresWrap:    { flexDirection: 'row', gap: 10, marginBottom: 20 },
  conectorCard:      { flex: 1, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 12 },
  conectorCardActive:{ borderColor: '#00E5FF', backgroundColor: 'rgba(0,229,255,0.08)' },
  conectorCardOff:   { opacity: 0.5 },
  conectorTop:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  conectorTipo:      { fontFamily: 'Syne-Bold', fontSize: 13, color: '#F0F4FF' },
  conectorDot:       { width: 8, height: 8, borderRadius: 4 },
  conectorPot:       { fontFamily: 'Syne-Bold', fontSize: 16, color: '#00E5FF', marginBottom: 2 },
  conectorPreco:     { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.45)' },
  conectorOccupied:  { fontFamily: 'Syne-Bold', fontSize: 10, color: '#FF3B5C', marginTop: 4 },
  textOff:           { color: 'rgba(240,244,255,0.3)' },

  amenRow:  { marginBottom: 8 },
  amenChip: { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  amenText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(240,244,255,0.6)' },

  reviewCard:       { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10 },
  reviewTop:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,229,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontFamily: 'Syne-Bold', fontSize: 14, color: '#00E5FF' },
  reviewInfo:       { flex: 1 },
  reviewUser:       { fontFamily: 'Syne-Bold', fontSize: 13, color: '#F0F4FF' },
  reviewData:       { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.35)', marginTop: 2 },
  reviewNota:       { fontFamily: 'Syne-Bold', fontSize: 12, color: '#FFB800' },
  reviewTexto:      { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(240,244,255,0.6)', lineHeight: 20 },

  bottomBar:  { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#070B14', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  precoWrap:  { flex: 1 },
  precoLabel: { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(240,244,255,0.4)' },
  precoVal:   { fontFamily: 'Syne-Bold', fontSize: 14, color: '#F0F4FF', marginTop: 2 },
  ctaBtn:     { flex: 1, height: 52, backgroundColor: '#00E5FF', borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#00E5FF', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  ctaBtnOff:  { backgroundColor: '#111827', shadowOpacity: 0 },
  ctaText:    { fontFamily: 'Syne-Bold', fontSize: 15, color: '#000' },
  ctaTextOff: { color: 'rgba(240,244,255,0.3)' },
});
