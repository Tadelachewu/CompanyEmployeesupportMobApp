import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log('Failed to load user', e);
    }
    setLoading(false);
  }

  async function handleLoginSuccess(userData, userToken) {
    setUser(userData);
    setToken(userToken);
    try {
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (e) {
      console.log('Failed to save user', e);
    }
  }

  async function handleLogout() {
    setUser(null);
    setToken(null);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (e) {
      console.log('Failed to clear user', e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, handleLogout, handleLoginSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};
