import { FlatList, StyleSheet, TouchableOpacity, Text, View, SafeAreaView, Image,Alert  } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
//react native elements
import { FAB } from '@rneui/themed'
//Snackbar
import Snackbar from 'react-native-snackbar'

//context API
import { AppwriteContext } from '../appwrite/AppwriteContext'

import { CHALLENGES_LIST } from '../data/constants'

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';

import { LinearGradient } from 'react-native-linear-gradient'

import Icon from 'react-native-vector-icons/MaterialIcons';

type HomeScreenProps = NativeStackScreenProps<AppStackParamList, 'Home'>

type UserObj = {
  name: String;
  email: String;
}

const Home = ({ navigation }: HomeScreenProps) => {
  const [userData, setUserData] = useState<UserObj>()
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext)

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: confirmLogout }
      ]
    );
  }

  const confirmLogout = () => {
    appwrite.logout()
      .then(() => {
        setIsLoggedIn(false);
        Snackbar.show({
          text: 'Logout Successful',
          duration: Snackbar.LENGTH_SHORT
        })
      })
  }

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



  return (
    <SafeAreaView style={styles.container}>


      <View style={styles.container}>
        <Text style={styles.header}>GIF Meme Challenges</Text>


        <FlatList
          data={CHALLENGES_LIST}
          renderItem={({ item }) => (

            <LinearGradient
              colors={item.challengeId == "1" ? ['#F3B431', '#EAF0F1'] :
                item.challengeId == "2" ? ['#8B78E6', '#EAF0F1'] :
                  ['#F5BCBA', '#EAF0F1']
              } // Replace with your desired colors
              style={styles.gradient}
            >
              <TouchableOpacity
                style={styles.challengeCard}
                onPress={() =>
                  navigation.navigate('ChallengeDetails', {
                    challengeId: item.challengeId
                  })}
              >
                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeDescription}>{item.description}</Text>
              </TouchableOpacity>
            </LinearGradient>

          )}
          keyExtractor={(item) => item.challengeId}
          contentContainerStyle={styles.list}
          removeClippedSubviews={false}
        />

      </View>

      <View style={styles.headerContainer}>
        {userData && (
          <View style={styles.userContainer}>
            <Icon name="account-circle" size={48} color="#FFFFFF" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
          </View>
        )}

        <FAB
          color="#333945"
          icon={<Icon name="logout" size={20} color="#FFFFFF" />} 
          onPress={handleLogout}
          style={styles.fab}
        />
      </View>

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D32',
  },
  fab: {
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    margin: 12,
    marginLeft: -2
  },
  icon: {
    marginRight: 10, 
    color: '#586776'
  },
  textContainer: {
    justifyContent: 'center', 
    color: '#586776'
  },
  userName: {
    fontSize: 18,
    color: '#A4B0BD',
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  gradient: {
    flex: 1,
    borderRadius: 8,
    elevation: 6,
    padding: 10,
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    marginLeft: 8,
    color: '#DAE0E2'

  },
  challengeCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 180
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',

  },
  challengeDescription: {
    fontSize: 20,
    color: '#666',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  welcomeContainer: {
    padding: 12,

    flex: 1,
    alignItems: 'center',
  },
  message: {
    fontSize: 26,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  userDetails: {
    fontSize: 18,
    color: '#616C6F',
  },
});

export default Home
