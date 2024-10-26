import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Signup from '../screens/Signup'
import Login from '../screens/Login'

import Icon from 'react-native-vector-icons/MaterialIcons';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();


export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: () => (
            <Icon name="login" size={24} color="#FFFFFF" />
          ),
          headerStyle: {
            backgroundColor: '#2B2B52',
          },
        }}
      />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}




