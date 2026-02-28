import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please enter username and password' });
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: e.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={theme.gradient} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.chessPiece, { color: theme.primary }]}>♟</Text>
            <Text style={[styles.title, { color: theme.text }]}>rChessMistry</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sign in to your board</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Welcome Back</Text>

            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Ionicons name="person-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Username"
                placeholderTextColor={theme.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={18} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In ♟</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.line, { backgroundColor: theme.cardBorder }]} />
              <Text style={[styles.dividerText, { color: theme.textMuted }]}>OR</Text>
              <View style={[styles.line, { backgroundColor: theme.cardBorder }]} />
            </View>

            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: theme.primary }]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.outlineButtonText, { color: theme.primary }]}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.brandText, { color: theme.textMuted }]}>by TheRJHub</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  chessPiece: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: 1 },
  subtitle: { fontSize: 14, marginTop: 4 },
  card: { borderRadius: 20, padding: 24, borderWidth: 1, marginBottom: 24 },
  cardTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    borderWidth: 1, paddingHorizontal: 14, height: 52, marginBottom: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  button: {
    height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  line: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 10, fontSize: 12 },
  outlineButton: {
    height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2,
  },
  outlineButtonText: { fontSize: 16, fontWeight: '700' },
  brandText: { textAlign: 'center', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
});
