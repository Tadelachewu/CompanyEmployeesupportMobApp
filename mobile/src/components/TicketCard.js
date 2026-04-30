import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge, StatusBadge } from './Badge';
import { getPriorityColor, getStatusColor, COLORS } from '../constants/theme';

export const TicketCard = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Badge label={item.priority || 'normal'} color={getPriorityColor(item.priority || 'normal')} />
      </View>
      <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.creatorText}>By: {item.creatorName}</Text>
        <StatusBadge label={item.status || 'open'} color={getStatusColor(item.status)} />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { 
    padding: 16, 
    backgroundColor: COLORS.surface, 
    borderRadius: 12, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 2}, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 3, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ticketTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, flex: 1, marginRight: 8 },
  description: { fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0', 
    paddingTop: 8 
  },
  creatorText: { fontSize: 11, color: '#888' },
});
