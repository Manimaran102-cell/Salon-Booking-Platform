import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING } from '../utils/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.replace('_', ' ')}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={[styles.input, { opacity: 0.5 }]} value={user?.email} editable={false} />

          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
          ])}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  content: { flex: 1, padding: SPACING.xl },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xxl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: COLORS.white, fontSize: 32, fontWeight: '700' },
  userName: { fontSize: 20, fontWeight: '700' },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  roleBadge: { marginTop: 8, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.primary + '15' },
  roleText: { fontSize: 13, fontWeight: '600', color: COLORS.primary, textTransform: 'capitalize' },
  form: { marginTop: SPACING.xl },
  label: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: 14, fontSize: 15, marginBottom: SPACING.lg },
  logoutBtn: { backgroundColor: COLORS.danger, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.lg },
  logoutBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
