import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING } from '../utils/theme';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return Alert.alert('Error', 'Please fill in required fields');
    setLoading(true);
    try {
      await register({ ...form, role: 'customer' });
    } catch (err) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Try again');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}><Text style={{ color: COLORS.accent }}>Glow</Text>Up</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="John Doe" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="you@example.com" value={form.email} onChangeText={v => setForm({ ...form, email: v })} keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.label}>Phone</Text>
            <TextInput style={styles.input} placeholder="555-123-4567" value={form.phone} onChangeText={v => setForm({ ...form, phone: v })} keyboardType="phone-pad" />
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Min. 6 characters" value={form.password} onChangeText={v => setForm({ ...form, password: v })} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkButton}>
              <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Sign In</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, paddingHorizontal: SPACING.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 42, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 8 },
  form: {},
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, fontSize: 16, marginBottom: SPACING.lg },
  button: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.sm },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  linkButton: { alignItems: 'center', marginTop: SPACING.xl },
  linkText: { fontSize: 14, color: COLORS.textSecondary },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});
