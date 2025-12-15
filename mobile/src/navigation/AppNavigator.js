import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MaterialsScreen from '../screens/MaterialsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Materials') {
            iconName = 'recycling';
          } else if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'Schedule') {
            iconName = 'calendar-today';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        headerShown: true
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Inicio', headerTitle: '🌱 EcoGestión Local' }}
      />
      <Tab.Screen 
        name="Materials" 
        component={MaterialsScreen} 
        options={{ title: 'Materiales', headerTitle: 'Guía de Separación' }}
      />
      <Tab.Screen 
        name="Map" 
        component={PlaceholderScreen} 
        options={{ title: 'Mapa', headerTitle: 'Centros de Reciclaje' }}
      />
      <Tab.Screen 
        name="Schedule" 
        component={PlaceholderScreen} 
        options={{ title: 'Calendario', headerTitle: 'Mi Calendario' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PlaceholderScreen} 
        options={{ title: 'Perfil', headerTitle: 'Mi Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Placeholder for unimplemented screens
function PlaceholderScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, color: '#7f8c8d' }}>Pantalla en desarrollo</Text>
    </View>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
