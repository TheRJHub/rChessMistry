import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

const THEMES = [
  { id: 'dark', label: 'Dark Mode', icon: '🌙', desc: 'Sleek dark theme', color: '#E94560' },
  { id: 'light', label: 'Light Mode', icon: '☀️', desc: 'Classic bright theme', color: '#8B4513' },
  { id: 'grey', label: 'Grey Mode', icon: '🌫️', desc: 'Tournament-style', color: '#AEAEB2' },
];

export default function SettingsScreen() {
  const { theme, themeName, setTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const handleThemeChange = async (name) => {
    setTheme(name);
    try {
      await api.put('/user/theme', { theme: name });
      await updateUser({ themePreference: name });
    } catch {}
    Toast.show({ type: 'success', text1: 'Theme Updated!', text2: `Switched to ${name} mode` });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Customize your experience</Text>
          </View>

          {/* Theme Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>
            {THEMES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.themeCard, {
                  backgroundColor: theme.card,
                  borderColor: themeName === t.id ? t.color : theme.cardBorder,
                  borderWidth: themeName === t.id ? 2 : 1,
                }]}
                onPress={() => handleThemeChange(t.id)}
              >
                <Text style={{ fontSize: 26 }}>{t.icon}</Text>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[styles.themeLabel, { color: theme.text }]}>{t.label}</Text>
                  <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>{t.desc}</Text>
                </View>
                {themeName === t.id && (
                  <View style={[styles.activeDot, { backgroundColor: t.color }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
            <View style={[styles.aboutCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={{ fontSize: 36, textAlign: 'center' }}>♟</Text>
              <Text style={[styles.appName, { color: theme.text }]}>rChessMistry</Text>
              <Text style={[styles.appVersion, { color: theme.textSecondary }]}>Version 1.0.0</Text>
              <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />
              <Text style={[styles.brandTag, { color: theme.textMuted }]}>by TheRJHub</Text>
              <Text style={[styles.moto, { color: theme.textMuted }]}>
                "Where Every Move Tells a Story"
              </Text>
            </View>
          </View>

          {/* Game Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GAME INFO</Text>
            {[
              { label: 'Account', value: `@${user?.username}`, icon: 'person-outline' },
              { label: 'Games Played', value: String(user?.gamesPlayed || 0), icon: 'game-controller-outline' },
              { label: 'Best Streak', value: String(user?.bestStreak || 0), icon: 'flame-outline' },
              { label: 'Preferred Theme', value: themeName, icon: 'color-palette-outline' },
            ].map((item) => (
              <View key={item.label} style={[styles.infoRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <Ionicons name={item.icon} size={18} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.text }]}>{item.label}</Text>
                <Text style={[styles.infoValue, { color: theme.textSecondary }]}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  themeCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, marginBottom: 8 },
  themeLabel: { fontSize: 15, fontWeight: '700' },
  themeDesc: { fontSize: 12, marginTop: 2 },
  activeDot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  aboutCard: { borderRadius: 16, padding: 20, borderWidth: 1, alignItems: 'center' },
  appName: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  appVersion: { fontSize: 13, marginTop: 2 },
  divider: { width: 40, height: 1, marginVertical: 12 },
  brandTag: { fontSize: 12, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  moto: { fontSize: 11, marginTop: 6, fontStyle: 'italic' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, marginBottom: 6, borderWidth: 1 },
  infoLabel: { flex: 1, fontSize: 14 },
  infoValue: { fontSize: 13 },
});
