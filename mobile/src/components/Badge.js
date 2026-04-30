import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Badge = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label.toUpperCase()}</Text>
  </View>
);

export const StatusBadge = ({ label, color }) => (
  <View style={[styles.statusBadge, { backgroundColor: color }]}>
    <Text style={styles.statusBadgeText}>{label.toUpperCase().replace('_', ' ')}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
