import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// ⚠️ Replace with your actual Google Form URL
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true';

export default function FeedbackScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>

        {/* Custom Header */}
        <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
          <View style={styles.headerLeft}>
            <Text style={{ fontSize: 24 }}>📝</Text>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>Feedback</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Help us improve rChessMistry</Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>TheRJHub</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Ionicons name="information-circle-outline" size={16} color={theme.accent} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Your feedback helps us build a better chess experience for everyone!
          </Text>
        </View>

        {/* Google Form */}
        <View style={{ flex: 1, position: 'relative' }}>
          {loading && (
            <View style={[styles.loadingOverlay, { backgroundColor: theme.background }]}>
              <Text style={{ fontSize: 36, marginBottom: 12 }}>♟</Text>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading feedback form...</Text>
            </View>
          )}
          <WebView
            source={{ uri: FEEDBACK_FORM_URL }}
            onLoadEnd={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingBottom: 14, borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 16, padding: 12, borderRadius: 12, borderWidth: 1,
  },
  infoText: { flex: 1, fontSize: 12 },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  loadingText: { marginTop: 10, fontSize: 13 },
});
