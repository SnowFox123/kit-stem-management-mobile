import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { UpdateStatusCart } from '../service/UserServices';
import { useNavigation } from '@react-navigation/native';

const CheckOut = ({ route }) => {
    const { selectedItems, cartItems, calculateTotalPrice } = route.params;
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleCheckOut = async () => {
        setLoading(true);
        const payload = {
            status: "completed",
            items: Array.from(selectedItems).map(id => {
                const item = cartItems.find(cartItem => cartItem._id === id);
                return item ? { _id: item._id, cart_no: item.cart_no } : null;
            }).filter(Boolean),
        };

        try {
           const update = await UpdateStatusCart(payload);
            console.log("🚀 ~ handleCheckOut ~ update:", update)
            Toast.show({
                text1: 'Checkout Successful',
                text2: `Your payment of $${calculateTotalPrice} was completed.`,
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
            });
            navigation.navigate('HomeScreen'); // Return to Home after successful checkout
        } catch (error) {
            console.error("Error during checkout:", error);
            Toast.show({
                text1: 'Error',
                text2: 'Failed to complete checkout. Please try again later.',
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmCheckOut = () => {
        Alert.alert(
            'Confirm Checkout',
            `Are you sure you want to checkout and complete payment of $${calculateTotalPrice}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: handleCheckOut },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <Text style={styles.totalText}>Total Payment: ${calculateTotalPrice}</Text>
            <TouchableOpacity
                onPress={confirmCheckOut}
                style={styles.checkoutButton}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Confirm Payment</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    totalText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 32,
    },
    checkoutButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CheckOut;
