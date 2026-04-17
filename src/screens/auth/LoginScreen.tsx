import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../../components/base/Typography';
export default function LoginScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.c, { backgroundColor: colors.bg }]}>
      <Typography variant="h2" color="cyan" center>LoginScreen</Typography>
      <Typography variant="body" color="t3" center style={{ marginTop: 8 }}>Em construção</Typography>
    </View>
  );
}
const styles = StyleSheet.create({ c: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
