import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { CHALLENGES_LIST } from '../data/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


type DetailsProps = NativeStackScreenProps<AppStackParamList, 'ChallengeDetails'>;

const ChallengeDetails = ({ route }: DetailsProps) => {
  // Get the challenge ID from the navigation route params
  const { challengeId } = route.params;

  // Get the challenge details based on the challengeId
  const challenge = CHALLENGES_LIST.find((item) => item.challengeId === challengeId);

  // Navigation hook
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // Handle undefined challenge case
  if (!challenge) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Challenge not found!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  

  return (
    <ImageBackground
      source={
        challenge.challengeId == '1'? require('../assets/catbackground.jpg'):
        challenge.challengeId == '2'? require('../assets/reactionBest.jpeg'):
        require('../assets/happyweekend.jpeg')
      } 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>{challenge.description}</Text>

        {/* Button to create a meme */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateMeme", { challengeId })}
        >
          <Text style={styles.buttonText}>Create Meme</Text>
        </TouchableOpacity>

        {/* Button to view submissions */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ViewSubmissions', { challengeId })}
        >
          <Text style={styles.buttonText}>View Submissions</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensure the image fills the screen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4C4B4B',
  },
  description: {
    fontSize: 16,
    color: '#586776',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
  },
});

export default ChallengeDetails;
