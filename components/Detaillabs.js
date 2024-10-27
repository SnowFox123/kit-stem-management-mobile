import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { getLabByID } from '../service/UserServices';

const Detaillabs = ({ route }) => {
    const { kitId } = route.params;
    const [kit, setKit] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchKitDetails();
        loadFavorites();
    }, [kitId]);

    const fetchKitDetails = async () => {
        try {
            const response = await getLabByID(kitId);
            if (response && response.success && response.data) {
                setKit(response.data); // assuming data comes directly under "data" in the response
            }
        } catch (error) {
            console.error("Error fetching kit details: ", error);
        }
    };

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteslabs');
            if (storedFavorites !== null) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Error loading favorites: ", error);
        }
    };

    const toggleFavorite = async (id) => {
        const updatedFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];

        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favoriteslabs', JSON.stringify(updatedFavorites));
    };

    const newPriceAfterDiscount = (price, discount) => {
        return price * (1 - discount / 100);
    };

    if (!kit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Fetching Lab Details...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: kit.lab_url }} style={styles.image} resizeMode="contain" />
                    <TouchableOpacity onPress={() => toggleFavorite(kit._id)} style={styles.favoriteIcon}>
                        <Icon name={favorites.includes(kit._id) ? 'heart' : 'heart-o'} size={24} color="red" />
                    </TouchableOpacity>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{kit.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.finalPrice}>
                            ${newPriceAfterDiscount(kit.price, kit.discount).toFixed(2)}
                        </Text>
                        <Text style={styles.originalPrice}>${kit.price.toFixed(2)}</Text>
                        <Text style={styles.discount}>-{kit.discount}%</Text>
                    </View>
                    <Text style={styles.category}>{kit.category_name}</Text>
                    <Text style={styles.descriptionTitle}>Description:</Text>
                    <Text style={styles.description}>{kit.description}</Text>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 10,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    favoriteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FFFFFFCC',
        borderRadius: 20,
        padding: 8,
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#FAFAFA',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginVertical: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    originalPrice: {
        fontSize: 18,
        color: '#ccc',
        textDecorationLine: 'line-through',
        marginHorizontal: 8,
    },
    finalPrice: {
        fontSize: 24,
        fontWeight: '700',
        color: 'rgb(0, 110, 173)',
    },
    discount: {
        fontSize: 18,
        color: '#FF424E',
        fontWeight: 'bold',
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 1,
        alignSelf: 'center',
    },
    category: {
        fontSize: 16,
        color: 'rgb(0, 110, 173)',
        marginVertical: 4,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginVertical: 10,
        color: '#333333',
    },
    description: {
        fontSize: 18,
        color: '#666666',
        lineHeight: 22,
    },
});

export default Detaillabs;
