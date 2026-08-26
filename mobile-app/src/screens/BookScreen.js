import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { format, addDays } from 'date-fns';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING } from '../utils/theme';

export default function BookScreen({ route, navigation }) {
  const { salonId } = route.params;
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [salon, setSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    API.get(`/salons/${salonId}`).then(res => setSalon(res.data.salon));
  }, [salonId]);

  useEffect(() => {
    if (selectedStaff && selectedDate && selectedServices.length > 0) {
      API.get(`/availability?staffId=${selectedStaff._id}&date=${format(selectedDate, 'yyyy-MM-dd')}&serviceId=${selectedServices[0]._id}`)
        .then(res => setSlots(res.data.slots));
    }
  }, [selectedStaff, selectedDate]);

  const toggleService = (s) => {
    setSelectedServices(prev => prev.find(x => x._id === s._id) ? prev.filter(x => x._id !== s._id) : [...prev, s]);
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  const handleBook = async () => {
    setBooking(true);
    try {
      await API.post('/appointments', {
        salon: salonId, staff: selectedStaff._id,
        services: selectedServices.map(s => s._id),
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime, endTime: selectedSlot.endTime,
      });
      Alert.alert('Success!', 'Your appointment has been booked.', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Booking failed');
    } finally { setBooking(false); }
  };

  if (!salon) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.stepsRow}>
          {[1, 2, 3, 4].map(s => (
            <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]}>
              <Text style={[styles.stepDotText, step >= s && styles.stepDotTextActive]}>{s}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Select Services</Text>
            {salon.serviceList?.map(service => (
              <TouchableOpacity key={service._id} style={[styles.serviceItem, selectedServices.find(s => s._id === service._id) && styles.serviceItemSelected]} onPress={() => toggleService(service)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>{service.duration} min</Text>
                </View>
                <Text style={styles.servicePrice}>${service.price}</Text>
              </TouchableOpacity>
            ))}
            {selectedServices.length > 0 && (
              <TouchableOpacity style={styles.continueBtn} onPress={() => setStep(2)}>
                <Text style={styles.continueBtnText}>Continue ({selectedServices.length} selected)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Choose Stylist</Text>
            {salon.staffList?.map(s => (
              <TouchableOpacity key={s._id} style={[styles.staffItem, selectedStaff?._id === s._id && styles.staffItemSelected]} onPress={() => setSelectedStaff(s)}>
                <View style={styles.staffAvatar}><Text style={styles.staffAvatarText}>{s.user?.name?.charAt(0)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.staffName}>{s.user?.name}</Text>
                  <Text style={styles.staffTitle}>{s.title}</Text>
                </View>
                <Text style={styles.staffRating}>⭐ {s.rating}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}><Text style={styles.backBtnText}>Back</Text></TouchableOpacity>
              {selectedStaff && <TouchableOpacity style={styles.continueBtn} onPress={() => setStep(3)}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Pick a Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {dates.map(date => {
                const active = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <TouchableOpacity key={date.toISOString()} style={[styles.dateBtn, active && styles.dateBtnActive]} onPress={() => { setSelectedDate(date); setSelectedSlot(null); }}>
                    <Text style={[styles.dateBtnDay, active && { color: COLORS.white }]}>{format(date, 'EEE')}</Text>
                    <Text style={[styles.dateBtnDate, active && { color: COLORS.white }]}>{format(date, 'd')}</Text>
                    <Text style={[styles.dateBtnMonth, active && { color: COLORS.white }]}>{format(date, 'MMM')}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedDate && (
              <>
                <Text style={styles.sectionTitle}>Pick a Time</Text>
                <View style={styles.slotsGrid}>
                  {slots.map(slot => (
                    <TouchableOpacity key={slot.startTime} style={[styles.timeSlot, !slot.available && styles.timeSlotBooked, selectedSlot?.startTime === slot.startTime && styles.timeSlotActive]} onPress={() => slot.available && setSelectedSlot(slot)} disabled={!slot.available}>
                      <Text style={[styles.timeSlotText, !slot.available && styles.timeSlotTextBooked, selectedSlot?.startTime === slot.startTime && { color: COLORS.white }]}>{slot.startTime}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}><Text style={styles.backBtnText}>Back</Text></TouchableOpacity>
              {selectedSlot && <TouchableOpacity style={styles.continueBtn} onPress={() => setStep(4)}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Confirm Booking</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Salon</Text><Text style={styles.summaryValue}>{salon.name}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Stylist</Text><Text style={styles.summaryValue}>{selectedStaff?.user?.name}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Services</Text><Text style={styles.summaryValue}>{selectedServices.map(s => s.name).join(', ')}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Date</Text><Text style={styles.summaryValue}>{selectedDate && format(selectedDate, 'MMM d, yyyy')}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Time</Text><Text style={styles.summaryValue}>{selectedSlot?.startTime}</Text></View>
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12, marginTop: 8 }]}><Text style={{ fontSize: 16, fontWeight: '700' }}>Total</Text><Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.primary }}>${totalPrice}</Text></View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(3)}><Text style={styles.backBtnText}>Back</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.continueBtn, booking && { opacity: 0.6 }]} onPress={handleBook} disabled={booking}>
                <Text style={styles.continueBtnText}>{booking ? 'Booking...' : `Confirm - $${totalPrice}`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  stepsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingVertical: 20 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.borderLight, alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: COLORS.primary },
  stepDotText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  stepDotTextActive: { color: COLORS.white },
  content: { padding: SPACING.xl },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: SPACING.lg },
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderWidth: 2, borderColor: COLORS.borderLight, borderRadius: 12, marginBottom: SPACING.md },
  serviceItemSelected: { borderColor: COLORS.primary, backgroundColor: 'rgba(108,60,225,0.04)' },
  serviceName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  serviceDuration: { fontSize: 12, color: COLORS.textSecondary },
  servicePrice: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  staffItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderWidth: 2, borderColor: COLORS.borderLight, borderRadius: 12, marginBottom: SPACING.md, gap: 12 },
  staffItemSelected: { borderColor: COLORS.primary },
  staffAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  staffAvatarText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  staffName: { fontSize: 15, fontWeight: '700' },
  staffTitle: { fontSize: 13, color: COLORS.primary },
  staffRating: { fontSize: 13 },
  dateBtn: { alignItems: 'center', padding: 12, marginRight: 10, borderRadius: 12, borderWidth: 2, borderColor: COLORS.borderLight, minWidth: 68 },
  dateBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateBtnDay: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  dateBtnDate: { fontSize: 20, fontWeight: '800', marginVertical: 2 },
  dateBtnMonth: { fontSize: 11, color: COLORS.textSecondary },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  timeSlot: { paddingVertical: 10, paddingHorizontal: 16, borderWidth: 2, borderColor: COLORS.borderLight, borderRadius: 8, backgroundColor: COLORS.white },
  timeSlotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeSlotBooked: { backgroundColor: COLORS.borderLight },
  timeSlotText: { fontSize: 14, fontWeight: '600' },
  timeSlotTextBooked: { color: COLORS.textLight },
  summaryCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.borderLight, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  backBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 2, borderColor: COLORS.border },
  backBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  continueBtn: { flex: 2, backgroundColor: COLORS.primary, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  continueBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
