import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import moment from 'moment';

export function GameHistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const res = await api.get('/user/game-history');
      setHistory(res.data);
    } catch (e) {
      console.log('History load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result) => {
    if (result === 'WIN') return theme.success;
    if (result === 'LOSS') return theme.error;
    return theme.warning;
  };

  const getResultIcon = (result) => {
    if (result === 'WIN') return '🏆';
    if (result === 'LOSS') return '😔';
    return '🤝';
  };

  const renderItem = ({ item }) => (
    <View style={[styles.histCard, { backgroundColor: theme.card, borderColor: getResultColor(item.result) + '44' }]}>
      <View style={styles.histLeft}>
        <Text style={{ fontSize: 22 }}>{getResultIcon(item.result)}</Text>
        <View>
          <Text style={[styles.histMode, { color: theme.text }]}>{item.gameMode}</Text>
          <Text style={[styles.histDate, { color: theme.textMuted }]}>
            {moment(item.playedAt).fromNow()}
          </Text>
        </View>
      </View>
      <View style={styles.histRight}>
        <View style={[styles.resultChip, { backgroundColor: getResultColor(item.result) + '22' }]}>
          <Text style={[styles.resultText, { color: getResultColor(item.result) }]}>{item.result}</Text>
        </View>
        <Text style={[styles.histMoves, { color: theme.textSecondary }]}>{item.totalMoves} moves</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Game History</Text>
          <View style={{ width: 22 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={{ fontSize: 48 }}>♟</Text>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>No games played yet!</Text>
                <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>Play your first game to see history here</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

export function LeaderboardScreen({ navigation }) {
  const { theme } = useTheme();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await api.get('/user/leaderboard');
      setLeaders(res.data);
    } catch (e) {
      console.log('Leaderboard load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const renderItem = ({ item, index }) => (
    <View style={[
      styles.leaderRow,
      { backgroundColor: theme.card, borderColor: index < 3 ? theme.accent + '44' : theme.cardBorder }
    ]}>
      <Text style={styles.medal}>{getMedalEmoji(index)}</Text>
      <View style={styles.leaderInfo}>
        <Text style={[styles.leaderName, { color: theme.text }]}>
          {item.displayName || item.username}
        </Text>
        <Text style={[styles.leaderSub, { color: theme.textMuted }]}>@{item.username}</Text>
      </View>
      <View style={styles.leaderStats}>
        <Text style={[styles.leaderWins, { color: theme.success }]}>{item.wins}W</Text>
        <Text style={[styles.leaderMuted, { color: theme.textMuted }]}> / {item.gamesPlayed}G</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Leaderboard</Text>
          <TouchableOpacity onPress={loadLeaderboard}>
            <Ionicons name="refresh-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.podiumBanner, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={{ fontSize: 28 }}>🏆</Text>
          <Text style={[styles.podiumText, { color: theme.text }]}>Top Players of rChessMistry</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={leaders}
            renderItem={renderItem}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  histCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  histLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  histMode: { fontSize: 14, fontWeight: '600' },
  histDate: { fontSize: 11, marginTop: 2 },
  histRight: { alignItems: 'flex-end', gap: 4 },
  resultChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  resultText: { fontSize: 11, fontWeight: '700' },
  histMoves: { fontSize: 11 },
  empty: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 13 },
  podiumBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: 16, padding: 14, borderRadius: 14, borderWidth: 1 },
  podiumText: { fontSize: 16, fontWeight: '700' },
  leaderRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  medal: { fontSize: 20, width: 36, textAlign: 'center' },
  leaderInfo: { flex: 1, marginLeft: 8 },
  leaderName: { fontSize: 15, fontWeight: '700' },
  leaderSub: { fontSize: 11, marginTop: 2 },
  leaderStats: { flexDirection: 'row', alignItems: 'center' },
  leaderWins: { fontSize: 15, fontWeight: '800' },
  leaderMuted: { fontSize: 13 },
});
