import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface RatingProps {
  submissionId: string;
  onRate: (submissionId: string, rating: number) => void; // Callback for when a rating is submitted
}

const Rating: React.FC<RatingProps> = ({ submissionId, onRate }) => {
  const [userRating, setUserRating] = React.useState<number | null>(null);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    onRate(submissionId, rating);
  };

  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleRating(star)}>
          <Text style={styles.star}>{userRating && userRating >= star ? '★' : '☆'}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.ratingText}>Your Rating: {userRating ? userRating : 'Not Rated'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  star: {
    fontSize: 24,
    marginHorizontal: 5,
    color: '#FFD700', 
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Rating;
