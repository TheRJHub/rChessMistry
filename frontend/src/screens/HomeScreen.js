import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, StatusBar, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GAME_MODES = [
  {
    id: 'MANUAL',
    title: 'Manual Play',
    subtitle: '2 Players · Same Device',
    description: 'Pass and play with a friend on one device',
    icon: '👥',
    emoji: '♟',
    gradient: ['#1a1a3e', '#2d2d6b'],
    badge: null,
    opponentType: 'HUMAN',
  },
  {
    id: 'EASY',
    title: 'Easy Bot',
    subtitle: 'vs Computer · Beginner',
    description: 'Perfect for learning the basics',
    icon: '🟢',
    emoji: '🤖',
    gradient: ['#1a3a1a', '#2d6b2d'],
    badge: 'CASUAL',
    opponentType: 'BOT',
  },
  {
    id: 'HARD',
    title: 'Hard Bot',
    subtitle: 'vs Computer · Expert',
    description: 'Test your strategy against a skilled opponent',
    icon: '🟡',
    emoji: '🤖',
    gradient: ['#3a2a00', '#6b5200'],
    badge: 'CHALLENGE',
    opponentType: 'BOT',
  },
  {
    id: 'UNBEATABLE',
    title: 'Unbeatable',
    subtitle: 'vs Computer · Master',
    description: 'Face the ultimate chess AI. Can you survive?',
    icon: '🔴',
    emoji: '👑',
    gradient: ['#3a0000', '#700000'],
    badge: 'EXTREME',
    opponentType: 'BOT',
  },
  {
    id: 'CLASSIC',
    title: 'Classic Mode',
    subtitle: 'Guided Play · Hints On',
    description: 'Get move hints and learn best strategies',
    icon: '💡',
    emoji: '🎓',
    gradient: ['#1a1a3a', '#2a2a6b'],
    badge: 'LEARNING',
    opponentType: 'BOT',
  },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const winRate = user?.gamesPlayed > 0
    ? Math.round((user.wins / user.gamesPlayed) * 100)
    : 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.statusBar === 'light' ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Header */}
          <LinearGradient colors={[theme.surface, theme.background]} style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={[styles.greeting, { color: theme.textSecondary }]}>Good game, Player</Text>
                <Text style={[styles.username, { color: theme.text }]}>
                  {user?.displayName || user?.username || 'Champion'} ♟
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.avatarBtn, { backgroundColor: theme.card, borderColor: theme.primary }]}
                onPress={() => navigation.navigate('Profile')}
              >
                {user?.profilePhotoUrl ? (
                  <Image source={{ uri: user.profilePhotoUrl }} style={styles.avatar} />
                ) : (
                  <Text style={{ fontSize: 22 }}>♚</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Stats Bar */}
            <View style={[styles.statsBar, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.success }]}>{user?.wins || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Wins</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.cardBorder }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.error }]}>{user?.losses || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Losses</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.cardBorder }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.warning }]}>{user?.draws || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Draws</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.cardBorder }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.accent }]}>{winRate}%</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Win Rate</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Links */}
          <View style={styles.quickLinks}>
            {[
              { label: 'Leaderboard', icon: 'trophy-outline', screen: 'Leaderboard', color: theme.accent },
              { label: 'History', icon: 'time-outline', screen: 'GameHistory', color: theme.primary },
              { label: 'Challenges', icon: 'flame-outline', screen: 'Challenges', color: theme.error },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.quickLink, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={[styles.quickLinkText, { color: theme.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose Your Game</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>Select a mode to start playing</Text>
          </View>

          {/* Game Mode Cards */}
          <View style={styles.modeGrid}>
            {/* First card full width */}
            <ModeCard
              mode={GAME_MODES[0]}
              theme={theme}
              onPress={() => navigation.navigate('ChessBoard', { mode: GAME_MODES[0] })}
              fullWidth
            />

            {/* Rest in 2 col */}
            <View style={styles.twoCol}>
              {GAME_MODES.slice(1).map((mode) => (
                <ModeCard
                  key={mode.id}
                  mode={mode}
                  theme={theme}
                  onPress={() => navigation.navigate('ChessBoard', { mode })}
                />
              ))}
            </View>
          </View>

          {/* Promo Banner */}
          <TouchableOpacity
            style={[styles.promoBanner, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={() => navigation.navigate('Challenges')}
          >
            <Text style={{ fontSize: 32 }}>🧩</Text>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.promoTitle, { color: theme.text }]}>Daily Challenges</Text>
              <Text style={[styles.promoSub, { color: theme.textSecondary }]}>Solve puzzles & earn points</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.primary} />
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ModeCard({ mode, theme, onPress, fullWidth }) {
  const cardWidth = fullWidth ? width - 32 : (width - 40) / 2;

  return (
    <TouchableOpacity
      style={[styles.modeCard, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient colors={mode.gradient} style={[styles.modeCardInner, fullWidth && styles.modeCardFull]}>
        {mode.badge && (
          <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={styles.badgeText}>{mode.badge}</Text>
          </View>
        )}
        <Text style={styles.modeEmoji}>{mode.emoji}</Text>
        <Text style={styles.modeTitle}>{mode.title}</Text>
        <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
        {fullWidth && <Text style={styles.modeDescription}>{mode.description}</Text>}
        <View style={styles.playBtn}>
          <Text style={styles.playBtnText}>Play Now →</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingTop: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  username: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  avatarBtn: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  statsBar: { flexDirection: 'row', borderRadius: 14, padding: 14, borderWidth: 1 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, textTransform: 'uppercase', marginTop: 2 },
  statDivider: { width: 1, height: '100%' },
  quickLinks: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginTop: 14 },
  quickLink: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  quickLinkText: { fontSize: 11, fontWeight: '600' },
  sectionHeader: { paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { fontSize: 12, marginTop: 2 },
  modeGrid: { paddingHorizontal: 16, gap: 8 },
  twoCol: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modeCard: { borderRadius: 16, overflow: 'hidden' },
  modeCardInner: { padding: 16, minHeight: 140, justifyContent: 'space-between' },
  modeCardFull: { minHeight: 130, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  badge: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  modeEmoji: { fontSize: 28, marginBottom: 6 },
  modeTitle: { color: '#fff', fontSize: 14, fontWeight: '800' },
  modeSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  modeDescription: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 4, flex: 1 },
  playBtn: { marginTop: 10, alignSelf: 'flex-start' },
  playBtnText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700' },
  promoBanner: {
    margin: 16, borderRadius: 16, padding: 18, flexDirection: 'row',
    alignItems: 'center', borderWidth: 1, marginTop: 8,
  },
  promoTitle: { fontSize: 16, fontWeight: '700' },
  promoSub: { fontSize: 12, marginTop: 3 },
});
