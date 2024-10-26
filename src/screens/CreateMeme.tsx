import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';

//context API
import { AppwriteContext } from '../appwrite/AppwriteContext'

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import Snackbar from 'react-native-snackbar'


type CreateMemeProps = NativeStackScreenProps<AppStackParamList, 'CreateMeme'>;

type UserObj = {
  name: String;
  email: String;
}

const CreateMeme = ({ route, navigation }: CreateMemeProps) => {
  const { challengeId } = route.params;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext)
  const [userData, setUserData] = useState<UserObj>()

  useEffect(() => {
    appwrite.getCurrentUser()
      .then(response => {
        if (response) {
          const user: UserObj = {
            name: response.name,
            email: response.email
          }
          setUserData(user)
        }
      })
  }, [appwrite])

  // Function to pick an image from the gallery
  const pickImageFromGallery = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
          setSelectedImage(response.assets[0].uri);
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Could not pick image');
        }
      }
    );
  };

  // Function to capture an image using the camera
  const captureImageWithCamera = () => {
    launchCamera(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
          setSelectedImage(response.assets[0].uri);
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Could not capture image');
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!selectedImage || !caption.trim()) {
      Alert.alert('Error', 'Please select an image and enter a caption!');
      return;
    }

    const memeData: MemeData = {
      selectedImage,
      caption,
      challengeId,
      createdAt: new Date().toISOString(),
      createdBy: userData?.name as string,
      ratings: {
        totalRating: 0,
        count: 0,
      },
    };

    const state = await NetInfo.fetch();
    if (state.isConnected) {
      console.log("state.isConnected 1", state.isConnected)
      await uploadMemeToFirebase(memeData);
    } else {
      console.log("state.isConnected 2", state.isConnected)
      await saveOfflineData(memeData);
    }
  };


  const saveOfflineData = async (memeData: MemeData) => {
    try {
      const offlineData = JSON.parse((await AsyncStorage.getItem('offlineMemes')) || '[]') as MemeData[];
      offlineData.push(memeData);
      await AsyncStorage.setItem('offlineMemes', JSON.stringify(offlineData));
      Alert.alert('Offline', 'Meme saved offline. It will sync once you are back online.');
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const syncOfflineData = async () => {
    try {
      const offlineMemes = await AsyncStorage.getItem('offlineMemes');
      if (offlineMemes) {
        const offlineData: MemeData[] = JSON.parse(offlineMemes);
        for (const meme of offlineData) {
          await uploadMemeToFirebase(meme);
        }
        // Clear the offline data after successful sync
        await AsyncStorage.removeItem('offlineMemes');
      }
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  // Monitor network connectivity and trigger sync
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncOfflineData(); // Sync when back online
      }
    });
    return () => unsubscribe();
  }, []);

  const uploadMemeToFirebase = async (memeData: MemeData) => {
    const filename = `${Date.now()}.jpg`;
    const reference = storage().ref(filename);

    try {
      await reference.putFile(memeData.selectedImage);
      const url = await reference.getDownloadURL();

      Snackbar.show({
        text: 'Meme submitted successfully!',
        duration: Snackbar.LENGTH_LONG
      })
      await firestore().collection('memes').add({
        url,
        caption: memeData.caption,
        challengeId: memeData.challengeId,
        createdAt: memeData.createdAt,
        createdBy: memeData.createdBy,
        ratings: {
          totalRating: memeData.ratings.totalRating,
          count: memeData.ratings.count,
        }
      });
      console.log('Meme submitted successfully!');

    } catch (error) {
      console.error('Error uploading meme:', error);
      Alert.alert('Error', 'Could not create meme. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Meme for Challenge #{challengeId}</Text>

      <TouchableOpacity onPress={pickImageFromGallery} style={styles.imagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an image from gallery</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={captureImageWithCamera} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Capture Image with Camera</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.captionInput}
        placeholder="Enter your meme caption here"
        placeholderTextColor="#616C6F"
        value={caption}
        onChangeText={setCaption}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Meme</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:  '#DAE0E2',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    backgroundColor: '#f9f9f9',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  imagePickerText: {
    color: '#999',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  captionInput: {
    borderColor: '#616C6F',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#6200ea',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateMeme;
