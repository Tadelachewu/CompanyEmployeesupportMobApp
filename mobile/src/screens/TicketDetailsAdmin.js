import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { TicketContext } from '../context/TicketContext';
import { Badge, StatusBadge } from '../components/Badge';
import { commonStyles } from '../styles/common';
import { API_BASE, getPriorityColor, getStatusColor, COLORS } from '../constants/theme';

export const TicketDetailsAdmin = ({ route }) => {
  const { ticketId } = route.params;
  const { token, user } = useContext(AuthContext);
  const { tickets, updateTicketLocally } = useContext(TicketContext);
  const [resolutionText, setResolutionText] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const ticket = tickets.find(t => t.id === ticketId);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const staff = res.data.filter(u => u.role === 'admin' || u.role === 'support');
        setAllUsers(staff);
      } catch (e) {
        console.log('Error fetching users for assignment');
      }
    }
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (ticket && ticket.assignedTo) {
      setSelectedAssignee(String(ticket.assignedTo));
    }
  }, [ticket]);

  async function cycleStatus() {
    if(!ticket) return;
    let nextStatus = 'open';
    if (ticket.status === 'open') nextStatus = 'in_progress';
    else if (ticket.status === 'in_progress') nextStatus = 'resolved';

    try {
      const res = await axios.put(`${API_BASE}/tickets/${ticket.id}`, { status: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateTicketLocally({ ...res.data, creatorName: ticket.creatorName, assigneeName: ticket.assigneeName });
    } catch(e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to cycle status');
    }
  }

  async function resolveTicket() {
    if(!ticket) return;
    const note = resolutionText || 'Resolved without note';
    try {
      const res = await axios.put(`${API_BASE}/tickets/${ticket.id}`, { status: 'resolved', resolutionNote: note }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateTicketLocally({ ...res.data, creatorName: ticket.creatorName, assigneeName: ticket.assigneeName });
    } catch(e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to resolve ticket');
    }
  }

  async function handleAssign() {
    if(!ticket || !selectedAssignee) return;
    try {
      const res = await axios.put(`${API_BASE}/tickets/${ticket.id}/assign`, { assignedTo: Number(selectedAssignee) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const assignee = allUsers.find(u => u.id === Number(selectedAssignee));
      updateTicketLocally({ ...res.data, creatorName: ticket.creatorName, assigneeName: assignee ? assignee.name : 'Unknown' });
      Alert.alert('Success', 'Ticket assigned successfully');
    } catch(e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to assign ticket');
    }
  }

  if (!ticket) return <Text style={{padding: 16}}>Loading...</Text>;

  return (
    <SafeAreaView style={commonStyles.container}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View style={{padding: 16}}>
            <Text style={[commonStyles.ticketTitle, {fontSize: 24, marginBottom: 8}]}>{ticket.title}</Text>
            <Text style={{fontSize: 16, marginBottom: 20, color: '#333', lineHeight: 22}}>{ticket.description}</Text>
            
            <View style={commonStyles.detailBox}>
              <View style={commonStyles.detailRow}><Text style={commonStyles.detailLabel}>ID:</Text><Text>#{ticket.id}</Text></View>
              <View style={commonStyles.detailRow}><Text style={commonStyles.detailLabel}>Creator:</Text><Text>{ticket.creatorName}</Text></View>
              <View style={commonStyles.detailRow}><Text style={commonStyles.detailLabel}>Assigned to:</Text><Text style={{fontWeight: 'bold', color: COLORS.primary}}>{ticket.assigneeName}</Text></View>
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

            <View style={commonStyles.adminActionSection}>
              {user.role === 'admin' && (
                <>
                  <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#2d3436'}}>Update Assignment</Text>
                  <View style={commonStyles.pickerContainer}>
                    <Picker
                      selectedValue={selectedAssignee}
                      onValueChange={(val) => setSelectedAssignee(val)}
                    >
                      <Picker.Item label="Select Staff Member..." value="" />
                      {allUsers.map(u => (
                        <Picker.Item key={u.id} label={u.name} value={String(u.id)} />
                      ))}
                    </Picker>
                  </View>
                  <TouchableOpacity style={[commonStyles.primaryButton, {marginTop: 8, backgroundColor: '#0984e3'}]} onPress={handleAssign}>
                    <Text style={commonStyles.buttonText}>Update Assignee</Text>
                  </TouchableOpacity>
                </>
              )}

              {(user.role === 'admin' || (user.role === 'support' && ticket.assignedTo === user.id)) ? (
                <>
                  <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 16, color: '#2d3436'}}>Workflow Actions</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity style={[commonStyles.secondaryButton, {flex: 1}]} onPress={cycleStatus}>
                      <Text style={commonStyles.secondaryButtonText}>Cycle Status</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {ticket.status === 'in_progress' && (
                    <View style={{marginTop: 20}}>
                      <Text style={{marginBottom: 8, fontWeight: '600', color: COLORS.textLight}}>Closing Notes</Text>
                      <TextInput
                        style={[commonStyles.input, {height: 80, textAlignVertical: 'top'}]}
                        placeholder="Describe how the issue was resolved..."
                        value={resolutionText}
                        onChangeText={setResolutionText}
                        multiline
                      />
                      <TouchableOpacity style={[commonStyles.primaryButton, {backgroundColor: COLORS.success}]} onPress={resolveTicket}>
                        <Text style={commonStyles.buttonText}>Resolve Ticket</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : user.role === 'support' && (
                <View style={{marginTop: 24, padding: 12, backgroundColor: '#fff3cd', borderRadius: 8}}>
                  <Text style={{color: '#856404', fontSize: 13}}>You can only perform actions on tickets assigned to you.</Text>
                </View>
              )}
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};
