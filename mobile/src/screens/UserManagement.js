import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { commonStyles } from '../styles/common';
import { API_BASE, COLORS } from '../constants/theme';

export const UserManagement = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch users');
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleCreateUser() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      await axios.post(`${API_BASE}/users`, { name, email, password, role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'User created successfully');
      setName(''); setEmail(''); setPassword('');
      fetchUsers();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to create user');
    }
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={
          <View style={{padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee'}}>
            <Text style={[commonStyles.subHeading, {marginBottom: 16}]}>Create New User</Text>
            <TextInput style={commonStyles.input} placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput style={commonStyles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={commonStyles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Text style={{fontSize: 12, marginBottom: 4, fontWeight: 'bold'}}>Role</Text>
            <View style={commonStyles.pickerContainer}>
              <Picker selectedValue={role} onValueChange={setRole}>
                <Picker.Item label="User (Employee)" value="user" />
                <Picker.Item label="Support (IT Staff)" value="support" />
                <Picker.Item label="Admin (IT Manager)" value="admin" />
              </Picker>
            </View>
            <TouchableOpacity style={commonStyles.primaryButton} onPress={handleCreateUser}>
              <Text style={commonStyles.buttonText}>Add User</Text>
            </TouchableOpacity>
            <Text style={[commonStyles.subHeading, {marginTop: 24, marginBottom: 8}]}>Existing Users</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
              <Text style={{fontSize: 12, color: COLORS.textLight}}>{item.email}</Text>
            </View>
            <Badge 
              label={item.role} 
              color={item.role === 'admin' ? COLORS.primary : item.role === 'support' ? COLORS.secondary : COLORS.success} 
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};
