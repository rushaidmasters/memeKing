import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {AppStackParamList} from '../routes/AppStack';
import Rating from '../components/Rating';

type ViewSubmissionsProps = NativeStackScreenProps<AppStackParamList, 'ViewSubmissions'>;

interface Submission {
  submissionId: string;
  imageUri: string;
  caption: string;
  createdBy: string;
  ratings: {
    totalRating: number; // Total score from all ratings
    count: number; // Number of ratings
  };
}

const ViewSubmissions = ({ route }: ViewSubmissionsProps) => {
  const { challengeId } = route.params;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch submissions from Firestore
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const snapshot = await firestore()
          .collection('memes')
          .where('challengeId', '==', challengeId)
          .orderBy('createdAt', 'desc')
          .get();
          

        const fetchedSubmissions: Submission[] = snapshot.docs.map((doc) => ({
          submissionId: doc.id,
          imageUri: doc.data().url, 
          caption: doc.data().caption,
          createdBy: doc.data().createdBy,
          ratings: doc.data().ratings,
        }));

        console.log("fetchedSubmissions",fetchedSubmissions)

        setSubmissions(fetchedSubmissions);
      } catch (error) {
        Alert.alert('Error', 'Failed to load submissions.');
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [challengeId]);

  const handleRateSubmission = async (submissionId: string, rating: number) => {
    const submissionRef = firestore().collection('memes').doc(submissionId);
  
    await firestore().runTransaction(async (transaction) => {
      const doc = await transaction.get(submissionRef);
      if (!doc.exists) {
        throw new Error("Document does not exist!");
      }
  
      const data = doc.data();
      
      // Check if data is defined before accessing properties
      if (data && data.ratings) {
        const newTotalRating = (data.ratings.totalRating || 0) + rating; // Default to 0 if undefined
        const newCount = (data.ratings.count || 0) + 1; // Default to 0 if undefined
  
        transaction.update(submissionRef, {
          'ratings.totalRating': newTotalRating,
          'ratings.count': newCount,
        });
      } else {
        // Handle the case where ratings data is not present
        throw new Error("Ratings data is not available in the document!");
      }
    });
  };
  
  const renderSubmission = ({ item }: { item: Submission }) => (
    <View style={styles.submissionContainer}>
      <Image source={{ uri: item.imageUri }} style={styles.submissionImage} />
      <Text style={styles.submissionCaption}>{item.caption}</Text>
      <Rating submissionId={item.submissionId} onRate={handleRateSubmission} />
   
      <Text style={styles.creatorText}>
      Created by: {item.createdBy}
      </Text>
      <Text style={styles.ratingText}>
        Average Rating: {item.ratings.count > 0 ? (item.ratings.totalRating / item.ratings.count).toFixed(1) : 'No Ratings'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Submissions for Challenge #{challengeId}</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading submissions...</Text>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.submissionId}
          renderItem={renderSubmission}
          contentContainerStyle={styles.list}
          removeClippedSubviews={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  createdBy: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  ratingText:{
    color: '#45CE30'
  },
  creatorText:{
    color: '#192A56'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  submissionContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  submissionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  submissionCaption: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
  },
});

export default ViewSubmissions;
