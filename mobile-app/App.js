import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { COLORS } from './src/utils/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import SalonDetailScreen from './src/screens/SalonDetailScreen';
import BookScreen from './src/screens/BookScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }) => (
  <View style={{ alignItems: 'center', opacity: focused ? 1 : 0.5 }}>
    <Text style={{ fontSize: 20 }}>{label === 'Discover' ? '🔍' : label === 'Bookings' ? '📅' : '👤'}</Text>
    <Text style={{ fontSize: 10, marginTop: 2, color: focused ? COLORS.primary : COLORS.textSecondary }}>{label}</Text>
  </View>
);

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 8 } }}>
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Discover" focused={focused} /> }} />
      <Tab.Screen name="Bookings" component={BookingsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Bookings" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.white }, headerTintColor: COLORS.text }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="SalonDetail" component={SalonDetailScreen} options={{ title: 'Salon Details' }} />
          <Stack.Screen name="Book" component={BookScreen} options={{ title: 'Book Appointment' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
