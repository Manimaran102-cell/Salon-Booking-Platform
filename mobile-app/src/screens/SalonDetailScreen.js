import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import API from '../utils/api';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';

export default function SalonDetailScreen({ route, navigation }) {
  const { salonId } = route.params;
  const [salon, setSalon] = useState(null);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    API.get(`/salons/${salonId}`).then(res => setSalon(res.data.salon));
  }, [salonId]);

  if (!salon) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{salon.name}</Text>
          <Text style={styles.heroSubtitle}>📍 {salon.address?.street}, {salon.address?.city}</Text>
          <Text style={styles.heroRating}>⭐ {salon.rating} ({salon.totalReviews} reviews)</Text>
        </View>

        <View style={styles.tabsRow}>
          {['services', 'staff', 'hours'].map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 'services' && salon.serviceList?.map(service => (
            <View key={service._id} style={styles.serviceItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc} numberOfLines={2}>{service.description}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.servicePrice}>${service.price}</Text>
                <Text style={styles.serviceDuration}>{service.duration} min</Text>
              </View>
            </View>
          ))}

          {activeTab === 'staff' && salon.staffList?.map(s => (
            <View key={s._id} style={styles.staffItem}>
              <View style={styles.staffAvatar}>
                <Text style={styles.staffAvatarText}>{s.user?.name?.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.staffName}>{s.user?.name}</Text>
                <Text style={styles.staffTitle}>{s.title}</Text>
                <Text style={styles.staffRating}>⭐ {s.rating}</Text>
              </View>
            </View>
          ))}

          {activeTab === 'hours' && days.map(day => {
            const h = salon.openingHours?.[day];
            return (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.hoursDay}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                <Text style={[styles.hoursTime, h?.isClosed && { color: COLORS.danger }]}>
                  {h?.isClosed ? 'Closed' : `${h?.open} - ${h?.close}`}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('Book', { salonId: salon._id })}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { backgroundColor: COLORS.primary, padding: SPACING.xl, paddingTop: 20 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: COLORS.white, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  heroRating: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.white },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary, marginBottom: -2 },
  tabText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  content: { padding: SPACING.xl },
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.lg, borderWidth: 2, borderColor: COLORS.borderLight, borderRadius: 12, marginBottom: SPACING.md },
  serviceName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  serviceDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  servicePrice: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  serviceDuration: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  staffItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderWidth: 2, borderColor: COLORS.borderLight, borderRadius: 12, marginBottom: SPACING.md, gap: 12 },
  staffAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  staffAvatarText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  staffName: { fontSize: 15, fontWeight: '700' },
  staffTitle: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  staffRating: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  hoursDay: { fontSize: 14, fontWeight: '500' },
  hoursTime: { fontSize: 14, color: COLORS.textSecondary },
  bottomBar: { padding: SPACING.lg, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  bookButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  bookButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
