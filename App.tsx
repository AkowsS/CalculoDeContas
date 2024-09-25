// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import PaidBillsScreen from './src/screens/PaidBillsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Cadastrar uma compra" component={HomeScreen} />
        <Stack.Screen name="Contas pagas" component={PaidBillsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
