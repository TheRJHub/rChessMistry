import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api, BASE_URL } from '../services/api';
import Toast from 'react-native-toast-message';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser, refreshProfile } = useAuth();
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);

  const winRate = user?.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadPhoto(result.assets[0]);
    }
  };

  const uploadPhoto = async (asset) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await api.post('/user/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await updateUser({ profilePhotoUrl: BASE_URL.replace('/api', '') + response.data.photoUrl });
      Toast.show({ type: 'success', text1: 'Photo Updated!', text2: 'Your profile photo has been saved.' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: e.message });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const ACHIEVEMENTS = [
    { icon: '🏆', title: 'First Win', earned: user?.wins >= 1 },
    { icon: '🔥', title: '5 Win Streak', earned: user?.bestStreak >= 5 },
    { icon: '⚡', title: 'Fast Mover', earned: user?.gamesPlayed >= 10 },
    { icon: '👑', title: 'Grandmaster', earned: user?.wins >= 50 },
    { icon: '🎯', title: 'Sharp Mind', earned: user?.gamesPlayed >= 25 },
    { icon: '♟️', title: 'Chess Lover', earned: user?.gamesPlayed >= 5 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Profile Header */}
          <LinearGradient colors={[theme.surface, theme.background]} style={styles.profileHeader}>
            <View style={styles.photoContainer}>
              <TouchableOpacity onPress={pickPhoto} disabled={uploading}>
                <View style={[styles.photoWrapper, { borderColor: theme.primary }]}>
                  {user?.profilePhotoUrl ? (
                    <Image source={{ uri: user.profilePhotoUrl }} style={styles.photo} />
                  ) : (
                    <View style={[styles.photoPlaceholder, { backgroundColor: theme.card }]}>
                      <Text style={{ fontSize: 44 }}>♚</Text>
                    </View>
                  )}
                  {uploading ? (
                    <View style={[styles.uploadOverlay, { backgroundColor: theme.background + 'CC' }]}>
                      <ActivityIndicator color={theme.primary} />
                    </View>
                  ) : (
                    <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                      <Ionicons name="camera" size={12} color="#fff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <Text style={[styles.displayName, { color: theme.text }]}>
              {user?.displayName || user?.username}
            </Text>
            <Text style={[styles.usernameTag, { color: theme.textSecondary }]}>
              @{user?.username}
            </Text>
            {user?.bestStreak > 0 && (
              <View style={[styles.streakBadge, { backgroundColor: theme.accent + '22', borderColor: theme.accent }]}>
                <Text style={[styles.streakText, { color: theme.accent }]}>🔥 Best Streak: {user.bestStreak}</Text>
              </View>
            )}
          </LinearGradient>

          {/* Stats Grid */}
          <View style={[styles.statsGrid, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {[
              { label: 'Wins', value: user?.wins || 0, color: theme.success, icon: '🏆' },
              { label: 'Losses', value: user?.losses || 0, color: theme.error, icon: '😞' },
              { label: 'Draws', value: user?.draws || 0, color: theme.warning, icon: '🤝' },
              { label: 'Played', value: user?.gamesPlayed || 0, color: theme.primary, icon: '♟' },
              { label: 'Win Rate', value: `${winRate}%`, color: theme.accent, icon: '📊' },
              { label: 'Streak', value: user?.bestStreak || 0, color: theme.textSecondary, icon: '🔥' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCell}>
                <Text style={{ fontSize: 20 }}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
            <View style={styles.achievementGrid}>
              {ACHIEVEMENTS.map((a, i) => (
                <View
                  key={i}
                  style={[styles.achievementCard, {
                    backgroundColor: a.earned ? theme.card : theme.surface,
                    borderColor: a.earned ? theme.accent : theme.cardBorder,
                    opacity: a.earned ? 1 : 0.45,
                  }]}
                >
                  <Text style={{ fontSize: 24 }}>{a.icon}</Text>
                  <Text style={[styles.achieveText, { color: theme.text }]}>{a.title}</Text>
                  {a.earned && <Text style={[styles.earnedTag, { color: theme.success }]}>Earned ✓</Text>}
                </View>
              ))}
            </View>
          </View>

          {/* Device Info */}
          {user?.deviceName && (
            <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Ionicons name="phone-portrait-outline" size={16} color={theme.textMuted} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Playing on: {user.deviceName}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={refreshProfile}
            >
              <Ionicons name="refresh-outline" size={20} color={theme.primary} />
              <Text style={[styles.actionRowText, { color: theme.text }]}>Sync Profile</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={theme.error} />
              <Text style={[styles.actionRowText, { color: theme.error }]}>Logout</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.brandText, { color: theme.textMuted }]}>rChessMistry · by TheRJHub</Text>
          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: { alignItems: 'center', padding: 24, paddingTop: 16 },
  photoContainer: { marginBottom: 12 },
  photoWrapper: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, overflow: 'visible' },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  uploadOverlay: { position: 'absolute', width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  displayName: { fontSize: 24, fontWeight: '800' },
  usernameTag: { fontSize: 14, marginTop: 4 },
  streakBadge: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  streakText: { fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: 16, borderRadius: 16, padding: 8, borderWidth: 1 },
  statCell: { width: '33.33%', alignItems: 'center', paddingVertical: 12 },
  statValue: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  statLabel: { fontSize: 10, textTransform: 'uppercase', marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  achievementCard: { width: '31%', alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 1 },
  achieveText: { fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  earnedTag: { fontSize: 9, marginTop: 3 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  infoText: { fontSize: 13 },
  actionSection: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  actionRowText: { flex: 1, fontSize: 15, fontWeight: '600' },
  brandText: { textAlign: 'center', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
});
