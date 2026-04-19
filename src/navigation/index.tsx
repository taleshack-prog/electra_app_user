import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Typography } from '../components/base/Typography';

import SplashScreen         from '../screens/auth/SplashScreen';
import LoginScreen          from '../screens/auth/LoginScreen';
import CadastroScreen       from '../screens/auth/CadastroScreen';
import Onboarding1Screen    from '../screens/onboarding/Onboarding1Screen';
import Onboarding2Screen    from '../screens/onboarding/Onboarding2Screen';
import SetupVeiculoScreen   from '../screens/onboarding/SetupVeiculoScreen';
import HomeScreen           from '../screens/main/HomeScreen';
import RecargaScreen        from '../screens/main/RecargaScreen';
import MapaScreen           from '../screens/main/MapaScreen';
import PerfilScreen         from '../screens/main/PerfilScreen';
import SOSScreen            from '../screens/sos/SOSScreen';
import ConfirmarSocorroScreen from '../screens/sos/ConfirmarSocorroScreen';
import TrackingScreen       from '../screens/sos/TrackingScreen';
import ConcluidoScreen      from '../screens/sos/ConcluidoScreen';
import RankingScreen from '../screens/sos/RankingScreen';
import SessaoRecargaScreen from '../screens/main/SessaoRecargaScreen';
import CheckoutRecargaScreen from '../screens/main/CheckoutRecargaScreen';
import MeusVeiculosScreen from '../screens/perfil/MeusVeiculosScreen';
import PagamentosScreen from '../screens/perfil/PagamentosScreen';

export type RootStackParamList = {
  Splash: undefined;
  // Primeiro acesso
  Onboarding1: undefined;
  Onboarding2: undefined;
  Cadastro: undefined;
  SetupVeiculo: undefined;
  // Usuário cadastrado
  Login: undefined;
  MainTabs: undefined;
  // SOS flow
  ConfirmarSocorro: undefined;
  Tracking: undefined;
  Concluido: undefined;
  Ranking: undefined;
  SessaoRecarga: undefined;
  MeusVeiculos: undefined;
  Pagamentos: undefined;
  CheckoutRecarga: undefined;
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

function TabBar({ state, navigation }: any) {
  const { colors } = useTheme();

  const tabs = [
    { name: 'Home',    icon: '⌂', label: 'Início' },
    { name: 'Recarga', icon: '⚡', label: 'Recarga' },
    { name: 'SOS',     icon: '!',  label: 'SOS',    isSOS: true },
    { name: 'Mapa',    icon: '◎', label: 'Mapa' },
    { name: 'Perfil',  icon: '○', label: 'Perfil' },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: 'rgba(13,19,32,0.97)', borderTopColor: colors.bd }]}>
      {tabs.map((tab, index) => {
        const focused = state.index === index;
        if (tab.isSOS) {
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => tab.name === 'SOS' ? navigation.navigate('ConfirmarSocorro') : navigation.navigate(tab.name)}
              activeOpacity={0.8}
              style={styles.sosWrap}
            >
              <View style={[styles.sosBtn, { backgroundColor: colors.red }]}>
                <Text style={styles.sosIcon}>!</Text>
              </View>
              <Text style={[styles.tabLabel, { color: colors.red }]}>SOS</Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => tab.name === 'SOS' ? navigation.navigate('ConfirmarSocorro') : navigation.navigate(tab.name)}
            activeOpacity={0.8}
            style={styles.tabItem}
          >
            <Text style={[styles.tabIcon, { color: focused ? colors.cyan : colors.t3 }]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, { color: focused ? colors.cyan : colors.t3, fontWeight: focused ? '700' : '400' }]}>
              {tab.label}
            </Text>
            {focused && <View style={[styles.tabDot, { backgroundColor: colors.cyan }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

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

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        {/* Splash — decide para onde ir */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Fluxo primeiro acesso */}
        <Stack.Screen name="Onboarding1"  component={Onboarding1Screen} />
        <Stack.Screen name="Onboarding2"  component={Onboarding2Screen} />
        <Stack.Screen name="Cadastro"     component={CadastroScreen} />
        <Stack.Screen name="SetupVeiculo" component={SetupVeiculoScreen} />

        {/* Fluxo usuário cadastrado */}
        <Stack.Screen name="Login"    component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* SOS flow */}
        <Stack.Screen name="ConfirmarSocorro" component={ConfirmarSocorroScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Tracking"         component={TrackingScreen} />
        <Stack.Screen name="Concluido"        component={ConcluidoScreen} />
        <Stack.Screen name="Ranking"           component={RankingScreen} />
        <Stack.Screen name="Pagamentos" component={PagamentosScreen} />
        <Stack.Screen name="MeusVeiculos"     component={MeusVeiculosScreen} />
        <Stack.Screen name="SessaoRecarga"    component={SessaoRecargaScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="CheckoutRecarga"  component={CheckoutRecargaScreen} options={{ animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar:   { height: 72, flexDirection: 'row', borderTopWidth: 1, paddingBottom: 8 },
  tabItem:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabIcon:  { fontSize: 20 },
  tabLabel: { fontSize: 10 },
  tabDot:   { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  sosWrap:  { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 6 },
  sosBtn:   { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 2, shadowColor: '#FF3B5C', shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  sosIcon:  { fontSize: 22, color: '#fff', fontWeight: 'bold' },
});
