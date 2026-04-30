import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { commonStyles } from '../styles/common';
import { API_BASE } from '../constants/theme';

export const LoginScreen = () => {
  const { handleLoginSuccess } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      handleLoginSuccess(res.data.user, res.data.token);
    } catch (e) {
      const msg = e.response?.data?.error || 'Login failed';
      setError(msg);
      Alert.alert('Login Error', msg);
    }
  }

  return (
    <SafeAreaView style={[commonStyles.container, {justifyContent: 'center', backgroundColor: '#f5f5f5'}]}>
      <View style={{padding: 24, backgroundColor: '#fff', margin: 20, borderRadius: 12, elevation: 4}}>
        <Text style={[commonStyles.heading, {textAlign: 'center', marginBottom: 24}]}>IT Support System</Text>
        {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
        <TextInput
          style={commonStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={commonStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={commonStyles.primaryButton} onPress={handleLogin}>
          <Text style={commonStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
