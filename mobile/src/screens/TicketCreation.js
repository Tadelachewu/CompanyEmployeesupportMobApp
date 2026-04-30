import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { TicketContext } from '../context/TicketContext';
import { commonStyles } from '../styles/common';
import { API_BASE } from '../constants/theme';

export const TicketCreation = ({ navigation }) => {
  const { token, user } = useContext(AuthContext);
  const { addTicketLocally } = useContext(TicketContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');

  async function createTicket() {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Validation Error', 'Title and description are required.');
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/tickets`,
        { title, description, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addTicketLocally({ ...res.data.ticket, creatorName: user.name, assigneeName: 'Unassigned' });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Creation Failed', e.response?.data?.error || 'Could not create ticket.');
    }
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{padding: 20}}>
        <Text style={commonStyles.fieldLabel}>Ticket Title</Text>
        <TextInput 
          style={commonStyles.input} 
          value={title} 
          onChangeText={setTitle} 
          placeholder="Brief summary of the issue" 
        />
        <Text style={commonStyles.fieldLabel}>Detailed Description</Text>
        <TextInput 
          style={[commonStyles.input, {height: 120, textAlignVertical: 'top'}]} 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Please describe the problem in detail..." 
          multiline
        />
        <Text style={commonStyles.fieldLabel}>Urgency / Priority</Text>
        <View style={commonStyles.pickerContainer}>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
          >
            <Picker.Item label="Low - General Inquiry" value="low" />
            <Picker.Item label="Normal - Standard Support" value="normal" />
            <Picker.Item label="High - Urgent Issue" value="high" />
          </Picker>
        </View>
        <View style={{marginTop: 24}}>
          <TouchableOpacity style={commonStyles.primaryButton} onPress={createTicket}>
            <Text style={commonStyles.buttonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
