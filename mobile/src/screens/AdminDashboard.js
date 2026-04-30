import React, { useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { TicketContext } from '../context/TicketContext';
import { TicketCard } from '../components/TicketCard';
import { commonStyles } from '../styles/common';
import { COLORS } from '../constants/theme';

export const AdminDashboard = ({ navigation }) => {
  const { user, handleLogout } = useContext(AuthContext);
  const { tickets, fetchTickets, refreshingTickets } = useContext(TicketContext);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.headerRow, {paddingHorizontal: 16, paddingTop: 16}]}>
        <View>
          <Text style={commonStyles.subHeading}>Hello, {user.name}</Text>
          <Text style={{fontSize: 12, color: COLORS.textLight}}>{user.role === 'admin' ? 'Administrator' : 'IT Support'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{color: COLORS.danger, fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {user.role === 'admin' && (
        <View style={{flexDirection: 'row', padding: 16, gap: 12}}>
          <TouchableOpacity 
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.primary }}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>Manage Users</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList 
        data={tickets} 
        keyExtractor={item => String(item.id)} 
        refreshControl={<RefreshControl refreshing={refreshingTickets} onRefresh={fetchTickets} />}
        contentContainerStyle={{padding: 16}}
        renderItem={({ item }) => (
          <TicketCard item={item} onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })} />
        )} 
      />
    </SafeAreaView>
  );
};
