import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

const DIFFICULTY_COLORS = {
  BEGINNER: '#4CAF50',
  INTERMEDIATE: '#FF9800',
  ADVANCED: '#F44336',
};

const DIFFICULTY_ICONS = {
  BEGINNER: '🟢',
  INTERMEDIATE: '🟡',
  ADVANCED: '🔴',
};

export default function ChallengesScreen({ navigation }) {
  const { theme } = useTheme();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { loadChallenges(); }, []);

  const loadChallenges = async () => {
    try {
      const res = await api.get('/challenges/public');
      setChallenges(res.data);
    } catch (e) {
      console.log('Challenges load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'ALL' ? challenges :
    challenges.filter(c => c.difficulty === filter);

  const renderChallenge = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      onPress={() => navigation.navigate('ChessBoard', {
        mode: {
          id: 'CHALLENGE',
          title: item.title,
          subtitle: `Challenge · ${item.difficulty}`,
          emoji: '🧩',
          opponentType: 'BOT',
          startFen: item.fen,
        }
      })}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[item.difficulty] + '22' }]}>
          <Text style={{ fontSize: 10 }}>{DIFFICULTY_ICONS[item.difficulty]}</Text>
          <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[item.difficulty] }]}>
            {item.difficulty}
          </Text>
        </View>
        <View style={[styles.pointsBadge, { backgroundColor: theme.accent + '22' }]}>
          <Text style={[styles.pointsText, { color: theme.accent }]}>{item.points} pts</Text>
        </View>
      </View>

      <Text style={[styles.challengeTitle, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.challengeDesc, { color: theme.textSecondary }]}>{item.description}</Text>

      <View style={styles.cardFooter}>
        <Text style={[styles.boardHint, { color: theme.textMuted }]}>Tap to play this challenge →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Challenges</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sharpen your chess skills</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, {
                backgroundColor: filter === f ? theme.primary : theme.card,
                borderColor: filter === f ? theme.primary : theme.cardBorder,
              }]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, { color: filter === f ? '#fff' : theme.textSecondary }]}>
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            renderItem={renderChallenge}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>No challenges found</Text>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: '600' },
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  diffBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  diffText: { fontSize: 10, fontWeight: '700' },
  pointsBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pointsText: { fontSize: 11, fontWeight: '700' },
  challengeTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  challengeDesc: { fontSize: 13, lineHeight: 18 },
  cardFooter: { marginTop: 12 },
  boardHint: { fontSize: 11 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
