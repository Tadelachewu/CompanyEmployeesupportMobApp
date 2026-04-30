import React, { useContext } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { TicketContext } from '../context/TicketContext';
import { Badge, StatusBadge } from '../components/Badge';
import { commonStyles } from '../styles/common';
import { getPriorityColor, getStatusColor } from '../constants/theme';

export const TicketDetailsUser = ({ route }) => {
  const { ticketId } = route.params;
  const { tickets } = useContext(TicketContext);

  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) return <Text style={{padding: 16}}>Loading...</Text>;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{padding: 16}}>
        <Text style={[commonStyles.ticketTitle, {fontSize: 24, marginBottom: 8}]}>{ticket.title}</Text>
        <Text style={{fontSize: 16, marginBottom: 20, color: '#333', lineHeight: 22}}>{ticket.description}</Text>
        
        <View style={commonStyles.detailBox}>
          <View style={commonStyles.detailRow}><Text style={commonStyles.detailLabel}>ID:</Text><Text>#{ticket.id}</Text></View>
          <View style={commonStyles.detailRow}><Text style={commonStyles.detailLabel}>Assigned to:</Text><Text>{ticket.assigneeName}</Text></View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
            <Badge label={ticket.priority || 'normal'} color={getPriorityColor(ticket.priority || 'normal')} />
            <StatusBadge label={ticket.status || 'open'} color={getStatusColor(ticket.status)} />
          </View>
        </View>

        {ticket.resolutionNote && (
          <View style={commonStyles.resolutionBox}>
            <Text style={{color: '#155724', fontWeight: 'bold', marginBottom: 4}}>Resolution Note:</Text>
            <Text style={{color: '#155724'}}>{ticket.resolutionNote}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
