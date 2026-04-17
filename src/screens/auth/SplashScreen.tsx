import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../../components/base/Typography';

export default function SplashScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.c, { backgroundColor: colors.bg }]}>
      <Typography variant="display" color="cyan" center>⚡</Typography>
      <Typography variant="h1" color="t1" center style={{ marginTop: 16 }}>ELECTRA</Typography>
      <Typography variant="label" color="cyan" center style={{ marginTop: 8 }}>RESCUE</Typography>
    </View>
  );
}
const styles = StyleSheet.create({ c: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
