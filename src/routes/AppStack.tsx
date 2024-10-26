import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../screens/Home'
import ChallengeDetails from '../screens/ChallengeDetails'
import CreateMeme from '../screens/CreateMeme'
import ViewSubmissions from '../screens/ViewSubmissions'

import Icon from 'react-native-vector-icons/MaterialIcons';

export type AppStackParamList = {
  Home: undefined;
  ChallengeDetails: { challengeId: string };
  CreateMeme: { challengeId: string };
  ViewSubmissions: { challengeId: string };
}

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        statusBarColor: '#2F363F',
      }}
    >
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerTitle: () => (
            <Icon name="home" size={24} color="#FFFFFF" />
          ),
          headerStyle: {
            backgroundColor: '#2B2B52',
          },
        }}
      
      />
      <Stack.Screen
        name='ChallengeDetails'
        component={ChallengeDetails}
        options={{
          title: "Challenge Details 💪"
        }}

      />
      <Stack.Screen
        name='CreateMeme'
        component={CreateMeme}
        options={{
          title: "Create Meme"
        }}

      />
      <Stack.Screen
        name='ViewSubmissions'
        component={ViewSubmissions}
        options={{
          title: "All Submissions 💫"
        }}

      />
    </Stack.Navigator>
  )
}





