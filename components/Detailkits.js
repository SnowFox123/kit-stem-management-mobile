import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { getKitByID } from '../service/UserServices';

const Detailkits = ({ route }) => {
    const { kitId } = route.params;
    const [kit, setKit] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchKitDetails();
        loadFavorites();
    }, [kitId]);

    const fetchKitDetails = async () => {
        try {
            const response = await getKitByID(kitId);
            console.log("🚀 ~ fetchKitDetails ~ response:", response.data)
            if (response) {
                setKit(response.data);
            }
        } catch (error) {
            console.error("Error fetching kit details: ", error);
            // Toast.show({
            //     text1: 'Error fetching kit details',
            //     text2: 'Please try again later.',
            //     position: 'top',
            //     type: 'error',
            //     visibilityTime: 2000,
            //     autoHide: true,
            // });
        }
    };

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteskits');
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
        await AsyncStorage.setItem('favoriteskits', JSON.stringify(updatedFavorites));

        // Toast.show({
        //     text1: favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites',
        //     position: 'top',
        //     type: 'success',
        //     visibilityTime: 2000,
        //     autoHide: true,
        // });
    };

    const newPriceAfterDiscount = (price, discount) => {
        return price * (1 - discount);
    };

    if (!kit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Fetching Kit Details...</Text>
            </View>
        );
    }

    const availableLabs = kit?.labs?.filter(lab => lab.is_deleted) || [];  // Add safe optional chaining


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: kit.image_url }} style={styles.image} resizeMode="contain" />
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
                        <Text style={styles.discount}>-{(kit.discount * 100).toFixed(0)}%</Text>
                    </View>
                    <Text style={styles.category}>{kit.category_name}</Text>
                    <Text style={styles.descriptionTitle}>Description:</Text>
                    <Text style={styles.description}>{kit.description}</Text>

                    {/* Render only available Labs */}
                    {/* Render only available Labs */}
                    <Text style={styles.labsTitle}>Recommended Labs:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                        {availableLabs.length > 0 ? (
                            availableLabs.map((lab) => (
                                <View key={lab._id} style={styles.labItem}>
                                    <Text style={styles.labTitle}>{lab.name}</Text>
                                    <Text style={styles.labDescription}>{lab.description}</Text>
                                    <Text style={styles.labPrice}>Price: ${lab.price.toFixed(2)}</Text>
                                    <TouchableOpacity onPress={() => {/* Navigate to lab details */ }}>
                                        <Text style={styles.labLink}>View Lab Details</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noLabsText}>No available labs.</Text>
                        )}
                    </ScrollView>

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
    labsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginVertical: 15,
    },
    horizontalScrollView: {
        marginVertical: 10,
    },
    labItem: {
        width: 200,
        padding: 15,
        marginHorizontal: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    labTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    labDescription: {
        fontSize: 14,
        color: '#666666',
        marginVertical: 4,
    },
    labPrice: {
        fontSize: 14,
        color: '#FF424E',
        fontWeight: '600',
        marginTop: 4,
    },
    labLink: {
        fontSize: 14,
        color: '#FF424E',
        marginTop: 8,
        textDecorationLine: 'underline',
    },
    noLabsText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Detailkits;
