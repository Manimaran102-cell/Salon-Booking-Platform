import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { format } from 'date-fns';
import API from '../utils/api';
import { COLORS, SPACING } from '../utils/theme';

export default function BookingsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      const { data } = await API.get('/appointments', { params });
      setAppointments(data.appointments);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchAppointments(); }, [filter]);

  const handleCancel = (id) => {
    Alert.alert('Cancel Appointment', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
        try { await API.put(`/appointments/${id}/cancel`, { reason: 'Cancelled by customer' }); fetchAppointments(); }
        catch (err) { Alert.alert('Error', 'Failed to cancel'); }
      }}
    ]);
  };

  const statusColor = (s) => ({ pending: COLORS.warning, confirmed: COLORS.primary, completed: COLORS.success, cancelled: COLORS.danger }[s] || COLORS.textSecondary);

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.salonName}>{item.salon?.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.serviceText}>{item.services?.map(s => s.service?.name).join(', ')} with {item.staff?.user?.name}</Text>
      <Text style={styles.dateText}>📅 {format(new Date(item.date), 'EEE, MMM d')} at {item.startTime}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>${item.totalPrice}</Text>
        {['pending', 'confirmed'].includes(item.status) && (
          <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item._id)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <View style={styles.filterRow}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterBtnActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={appointments}
        renderItem={renderBooking}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAppointments(); }} tintColor={COLORS.primary} />}
        ListEmptyComponent={!loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.xl, gap: 6, marginBottom: SPACING.md },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.borderLight },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white },
  list: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  salonName: { fontSize: 16, fontWeight: '700', flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  serviceText: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
  dateText: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 12 },
  price: { fontSize: 18, fontWeight: '800' },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.danger },
  cancelBtnText: { color: COLORS.danger, fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
});
