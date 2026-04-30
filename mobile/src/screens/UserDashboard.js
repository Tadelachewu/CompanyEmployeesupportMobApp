import React, { useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { TicketContext } from '../context/TicketContext';
import { TicketCard } from '../components/TicketCard';
import { commonStyles } from '../styles/common';
import { COLORS } from '../constants/theme';

export const UserDashboard = ({ navigation }) => {
  const { user, handleLogout } = useContext(AuthContext);
  const { tickets, fetchTickets, refreshingTickets } = useContext(TicketContext);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.headerRow, {paddingHorizontal: 16, paddingTop: 16}]}>
        <Text style={commonStyles.subHeading}>My Tickets</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{color: COLORS.danger, fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={{padding: 16}}>
        <TouchableOpacity 
          style={[commonStyles.primaryButton, {backgroundColor: COLORS.success}]} 
          onPress={() => navigation.navigate('TicketCreation')}
        >
          <Text style={commonStyles.buttonText}>+ New Support Request</Text>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={tickets} 
        keyExtractor={item => String(item.id)} 
        refreshControl={<RefreshControl refreshing={refreshingTickets} onRefresh={fetchTickets} />}
        contentContainerStyle={{paddingHorizontal: 16}}
        renderItem={({ item }) => (
          <TicketCard item={item} onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })} />
        )} 
      />
    </SafeAreaView>
  );
};
