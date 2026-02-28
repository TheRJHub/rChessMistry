import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import Toast from 'react-native-toast-message';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | 'available' | 'taken' | 'checking'

  const checkUsername = async (value) => {
    setUsername(value);
    if (value.length < 3) { setUsernameStatus(null); return; }
    setUsernameStatus('checking');
    try {
      const res = await api.get(`/auth/check-username/${value}`);
      setUsernameStatus(res.data.available ? 'available' : 'taken');
    } catch {
      setUsernameStatus(null);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !password || !confirmPass) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please fill in all required fields' });
      return;
    }
    if (password !== confirmPass) {
      Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match' });
      return;
    }
    if (password.length < 4) {
      Toast.show({ type: 'error', text1: 'Weak Password', text2: 'Password must be at least 4 characters' });
      return;
    }
    if (usernameStatus === 'taken') {
      Toast.show({ type: 'error', text1: 'Username Taken', text2: 'Please choose a different username' });
      return;
    }
    setLoading(true);
    try {
      await register(username.trim(), password, displayName.trim() || username.trim());
      Toast.show({ type: 'success', text1: 'Welcome! 🎉', text2: 'Account created successfully!' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Register Failed', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const usernameIcon = usernameStatus === 'available' ? 'checkmark-circle' :
                       usernameStatus === 'taken' ? 'close-circle' :
                       usernameStatus === 'checking' ? 'ellipsis-horizontal' : null;
  const usernameColor = usernameStatus === 'available' ? theme.success :
                        usernameStatus === 'taken' ? theme.error : theme.textMuted;

  return (
    <LinearGradient colors={theme.gradient} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.chessPiece, { color: theme.primary }]}>♞</Text>
            <Text style={[styles.title, { color: theme.text }]}>Join rChessMistry</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Create your player identity</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>

            {/* Username */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Username *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Ionicons name="at-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Choose a unique username"
                placeholderTextColor={theme.textMuted}
                value={username}
                onChangeText={checkUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {usernameIcon && <Ionicons name={usernameIcon} size={18} color={usernameColor} />}
            </View>

            {/* Display Name */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Display Name (optional)</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Ionicons name="person-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="How others see you"
                placeholderTextColor={theme.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Password *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Min 4 characters"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={18} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Confirm Password *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Repeat password"
                placeholderTextColor={theme.textMuted}
                value={confirmPass}
                onChangeText={setConfirmPass}
                secureTextEntry={!showPass}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account ♟</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginText, { color: theme.textSecondary }]}>
                Already have an account? <Text style={{ color: theme.primary }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.brandText, { color: theme.textMuted }]}>by TheRJHub</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 16, width: 40 },
  header: { alignItems: 'center', marginBottom: 28 },
  chessPiece: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 4 },
  card: { borderRadius: 20, padding: 24, borderWidth: 1, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    borderWidth: 1, paddingHorizontal: 14, height: 50, marginBottom: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  button: { height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 16 },
  loginText: { fontSize: 14 },
  brandText: { textAlign: 'center', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
});
