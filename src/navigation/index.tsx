import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Typography } from '../components/base/Typography';

// ── Screens (placeholders por agora) ──────────────────────────
import SplashScreen       from '../screens/auth/SplashScreen';
import LoginScreen        from '../screens/auth/LoginScreen';
import CadastroScreen     from '../screens/auth/CadastroScreen';
import Onboarding1Screen  from '../screens/onboarding/Onboarding1Screen';
import Onboarding2Screen  from '../screens/onboarding/Onboarding2Screen';
import SetupVeiculoScreen from '../screens/onboarding/SetupVeiculoScreen';
import SetupAutonomiaScreen from '../screens/onboarding/SetupAutonomiaScreen';
import HomeScreen         from '../screens/main/HomeScreen';
import RecargaScreen      from '../screens/main/RecargaScreen';
import MapaScreen         from '../screens/main/MapaScreen';
import PerfilScreen       from '../screens/main/PerfilScreen';
import SOSScreen          from '../screens/sos/SOSScreen';
import ConfirmarSocorroScreen from '../screens/sos/ConfirmarSocorroScreen';
import TrackingScreen     from '../screens/sos/TrackingScreen';
import ConcluidoScreen    from '../screens/sos/ConcluidoScreen';
import RankingScreen      from '../screens/sos/RankingScreen';

// ── Types ──────────────────────────────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  SetupVeiculo: undefined;
  SetupAutonomia: undefined;
  MainTabs: undefined;
  ConfirmarSocorro: undefined;
  Tracking: undefined;
  Concluido: undefined;
  Ranking: undefined;
};

export type TabParamList = {
  Home: undefined;
  Recarga: undefined;
  SOS: undefined;
  Mapa: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

// ── Tab Bar customizada ────────────────────────────────────────
function TabBar({ state, descriptors, navigation }: any) {
  const { colors, radius } = useTheme();

  const icons: Record<string, string> = {
    Home: '⌂', Recarga: '⚡', SOS: '!', Mapa: '◎', Perfil: '○',
  };

  return (
    <View style={[styles.tabBar, { backgroundColor: 'rgba(13,19,32,0.97)', borderTopColor: colors.bd }]}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const isSOS   = route.name === 'SOS';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.8}
            style={[styles.tabItem, isSOS && styles.sosItem]}
          >
            {isSOS ? (
              <View style={[styles.sosBtn, { backgroundColor: colors.red }]}>
                <Typography variant="h3" color="white">!</Typography>
              </View>
            ) : (
              <>
                <Typography
                  variant="bodyLg"
                  style={{ color: focused ? colors.cyan : colors.t3, fontSize: 20 }}
                >
                  {icons[route.name]}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: focused ? colors.cyan : colors.t3, fontWeight: focused ? '700' : '400', marginTop: 2 }}
                >
                  {route.name}
                </Typography>
                {focused && (
                  <View style={[styles.dot, { backgroundColor: colors.cyan }]} />
                )}
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Tab Navigator ──────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Recarga" component={RecargaScreen} />
      <Tab.Screen name="SOS"     component={SOSScreen} />
      <Tab.Screen name="Mapa"    component={MapaScreen} />
      <Tab.Screen name="Perfil"  component={PerfilScreen} />
    </Tab.Navigator>
  );
}

// ── Root Navigator ─────────────────────────────────────────────
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        {/* Auth */}
        <Stack.Screen name="Splash"   component={SplashScreen} />
        <Stack.Screen name="Login"    component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />

        {/* Onboarding */}
        <Stack.Screen name="Onboarding1"    component={Onboarding1Screen} />
        <Stack.Screen name="Onboarding2"    component={Onboarding2Screen} />
        <Stack.Screen name="SetupVeiculo"   component={SetupVeiculoScreen} />
        <Stack.Screen name="SetupAutonomia" component={SetupAutonomiaScreen} />

        {/* Main */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* SOS Flow */}
        <Stack.Screen name="ConfirmarSocorro" component={ConfirmarSocorroScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Tracking"         component={TrackingScreen} />
        <Stack.Screen name="Concluido"        component={ConcluidoScreen} />
        <Stack.Screen name="Ranking"          component={RankingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar:   { height: 72, flexDirection: 'row', borderTopWidth: 1, paddingBottom: 8 },
  tabItem:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  sosItem:  { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  sosBtn:   { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 4, shadowColor: '#FF3B5C', shadowOpacity: 0.5, shadowRadius: 16, elevation: 8 },
  dot:      { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
});
