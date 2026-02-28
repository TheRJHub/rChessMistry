import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function LeaderboardScreen({ navigation }) {
  const { theme } = useTheme();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/leaderboard');
      setLeaders(res.data);
    } catch (e) {
      console.log('Leaderboard load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  const renderItem = ({ item, index }) => (
    <View style={[
      styles.row,
      { backgroundColor: theme.card, borderColor: index < 3 ? theme.accent + '44' : theme.cardBorder }
    ]}>
      <Text style={styles.medal}>{getMedal(index)}</Text>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={[styles.name, { color: theme.text }]}>{item.displayName || item.username}</Text>
        <Text style={[styles.sub, { color: theme.textMuted }]}>@{item.username}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.wins, { color: theme.success }]}>{item.wins} wins</Text>
        <Text style={[styles.games, { color: theme.textMuted }]}>{item.gamesPlayed} games</Text>
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
          <Text style={[styles.title, { color: theme.text }]}>🏆 Leaderboard</Text>
          <TouchableOpacity onPress={loadLeaderboard}>
            <Ionicons name="refresh-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={leaders}
            renderItem={renderItem}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={{ color: theme.textMuted, textAlign: 'center', marginTop: 40 }}>No players yet!</Text>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  medal: { fontSize: 20, width: 36, textAlign: 'center' },
  name: { fontSize: 15, fontWeight: '700' },
  sub: { fontSize: 11, marginTop: 2 },
  wins: { fontSize: 15, fontWeight: '800' },
  games: { fontSize: 11, marginTop: 2 },
});
