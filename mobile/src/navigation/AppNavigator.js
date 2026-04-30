import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { AdminDashboard } from '../screens/AdminDashboard';
import { UserDashboard } from '../screens/UserDashboard';
import { TicketCreation } from '../screens/TicketCreation';
import { TicketDetailsAdmin } from '../screens/TicketDetailsAdmin';
import { TicketDetailsUser } from '../screens/TicketDetailsUser';
import { UserManagement } from '../screens/UserManagement';

const Stack = createNativeStackNavigator();

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
    <Stack.Screen name="TicketDetails" component={TicketDetailsAdmin} options={{ title: 'Ticket Details' }} />
    <Stack.Screen name="UserManagement" component={UserManagement} options={{ title: 'User Management' }} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: 'My Tickets' }} />
    <Stack.Screen name="TicketCreation" component={TicketCreation} options={{ title: 'Create Ticket' }} />
    <Stack.Screen name="TicketDetails" component={TicketDetailsUser} options={{ title: 'Ticket Details' }} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (user.role === 'admin' || user.role === 'support') ? (
        <Stack.Screen name="AdminStack" component={AdminStack} />
      ) : (
        <Stack.Screen name="UserStack" component={UserStack} />
      )}
    </Stack.Navigator>
  );
};
