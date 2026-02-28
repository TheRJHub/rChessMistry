import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const { theme } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.chessPiece, { color: theme.primary }]}>♟</Text>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={[styles.appName, { color: theme.text }]}>rChessMistry</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>Where Every Move Tells a Story</Text>
          <View style={[styles.divider, { backgroundColor: theme.primary }]} />
          <Text style={[styles.brand, { color: theme.textMuted }]}>by TheRJHub</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.bottomGrid, { opacity: fadeAnim }]}>
        {['♜','♞','♝','♛','♚','♝','♞','♜'].map((piece, i) => (
          <Text key={i} style={[styles.gridPiece, { color: theme.textMuted, opacity: 0.15 }]}>{piece}</Text>
        ))}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center', zIndex: 10 },
  chessPiece: { fontSize: 80, marginBottom: 16 },
  appName: { fontSize: 42, fontWeight: '800', letterSpacing: 2, textAlign: 'center' },
  tagline: { fontSize: 14, marginTop: 8, textAlign: 'center', letterSpacing: 1 },
  divider: { height: 2, width: 60, marginVertical: 12, alignSelf: 'center', borderRadius: 1 },
  brand: { fontSize: 12, letterSpacing: 3, textAlign: 'center', textTransform: 'uppercase' },
  bottomGrid: {
    position: 'absolute', bottom: 40, flexDirection: 'row',
    width: '100%', justifyContent: 'space-around', paddingHorizontal: 20,
  },
  gridPiece: { fontSize: 28 },
});
