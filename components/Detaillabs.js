import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { getLabByID, addToCart } from '../service/UserServices'; // Make sure addToCart is imported
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView from the new library

const Detaillabs = ({ route, navigation }) => {
    const { kitId } = route.params;
    const [kit, setKit] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchLabDetails();
        loadFavorites();
    }, [kitId]);

    const fetchLabDetails = async () => {
        try {
            const response = await getLabByID(kitId);
            if (response && response.success && response.data) {
                setKit(response.data); // assuming data comes directly under "data" in the response
            }
        } catch (error) {
            console.error("Error fetching lab details: ", error);
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

        Toast.show({
            text1: favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites',
            position: 'top',
            type: 'success',
            visibilityTime: 2000,
            autoHide: true,
        });
    };

    const handleAddToCart = async () => {
        try {
            const payload = {
                product_id: kit._id,
                product_type: "lab",
            };
            await addToCart(payload);
            Toast.show({
                text1: 'Added to Cart',
                text2: `${kit.name} has been added to your cart!`,
                position: 'top',
                type: 'success',
                visibilityTime: 2000,
                autoHide: true,
            });
        } catch (error) {
            console.error("Error adding to cart: ", error);
            Toast.show({
                text1: 'Error Adding to Cart',
                text2: 'Please try again later.',
                position: 'top',
                type: 'error',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
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
        <SafeAreaView style={styles.container}>

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lab Details</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CartUser')} style={styles.headerButton}>
                        <Icon name="shopping-cart" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
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

                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgb(0, 110, 173)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerButton: {
        padding: 10,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
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
    addToCartButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Detaillabs;
