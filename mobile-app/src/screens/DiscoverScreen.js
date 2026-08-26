import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import API from '../utils/api';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';

export default function DiscoverScreen({ navigation }) {
  const [salons, setSalons] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSalons = async () => {
    try {
      const params = { limit: 20 };
      if (search) params.search = search;
      const { data } = await API.get('/salons', { params });
      setSalons(data.salons);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchSalons(); }, [search]);

  const onRefresh = () => { setRefreshing(true); fetchSalons(); };

  const renderSalon = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SalonDetail', { salonId: item._id })}>
      <View style={styles.cardImage}>
        <Text style={styles.cardPlaceholderIcon}>✨</Text>
        {item.isFeatured && <View style={styles.featuredBadge}><Text style={styles.featuredText}>Featured</Text></View>}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardLocation}>📍 {item.address?.city}, {item.address?.state}</Text>
        <View style={styles.tagsRow}>
          {(item.categories || []).slice(0, 3).map(c => (
            <View key={c} style={styles.tag}><Text style={styles.tagText}>{c}</Text></View>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.rating}>⭐ {item.rating} ({item.totalReviews})</Text>
          <Text style={styles.viewText}>View →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your perfect salon</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="🔍  Search salons..." value={search} onChangeText={setSearch} />
      </View>

      <FlatList
        data={salons}
        renderItem={renderSalon}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={!loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No salons found</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  searchContainer: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },
  searchInput: { backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  list: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.md },
  cardImage: { height: 140, backgroundColor: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, background: `#${COLORS.primary.slice(1)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary },
  cardPlaceholderIcon: { fontSize: 36 },
  featuredBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  featuredText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  cardBody: { padding: SPACING.lg },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardLocation: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  tag: { backgroundColor: COLORS.borderLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, color: COLORS.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 10 },
  rating: { fontSize: 14, fontWeight: '600' },
  viewText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
});
