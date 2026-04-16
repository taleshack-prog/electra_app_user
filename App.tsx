import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeProvider';

// Navegação virá aqui
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <View style={styles.center}>
            <Text style={styles.text}>⚡ ELECTRA Rescue</Text>
            <Text style={styles.sub}>Design System pronto</Text>
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#070B14' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text:   { fontSize: 24, fontWeight: 'bold', color: '#00E5FF' },
  sub:    { fontSize: 14, color: 'rgba(240,244,255,0.4)', marginTop: 8 },
});
