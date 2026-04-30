import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { TicketProvider } from './src/context/TicketContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TicketProvider>
    </AuthProvider>
  );
}
