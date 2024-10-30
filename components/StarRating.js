// StarRating.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (v, i) => i < rating ? 'star' : 'star-o');
    
    return (
        <View style={styles.container}>
            {stars.map((star, index) => (
                <Icon key={index} name={star} size={20} color="#FFD700" />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});

export default StarRating;
