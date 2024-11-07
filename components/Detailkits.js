import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { getKitByID, addToCart, getUserDetail } from '../service/UserServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarRating from './StarRating';

const Detailkits = ({ route }) => {
    const navigation = useNavigation();
    const { kitId } = route.params;
    const [kit, setKit] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [users, setUsers] = useState({});
    const [selectedRating, setSelectedRating] = useState(null);
    const scrollRef = useRef(); // Scroll reference for auto-scroll

    useEffect(() => {
        fetchKitDetails();
        loadFavorites();
    }, [kitId]);

    const fetchKitDetails = async () => {
        try {
            const response = await getKitByID(kitId);
            if (response) {
                setKit(response.data);
                await fetchUserDetails(response.data.reviews);
            }
        } catch (error) {
            console.error("Error fetching kit details: ", error);
            Toast.show({
                text1: 'Error fetching kit details',
                text2: 'Please try again later.',
                position: 'top',
                type: 'error',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };

    const fetchUserDetails = async (reviews) => {
        const userPromises = reviews.map(async (review) => {
            if (review.user_id) {
                try {
                    const userResponse = await getUserDetail(review.user_id);
                    return { userId: review.user_id, userName: userResponse.data.name };
                } catch (error) {
                    console.error("Error fetching user details: ", error);
                    return { userId: review.user_id, userName: "Unknown User" };
                }
            }
            return { userId: review.user_id, userName: "Unknown User" };
        });

        const userDetails = await Promise.all(userPromises);
        const userMap = userDetails.reduce((acc, { userId, userName }) => {
            acc[userId] = userName;
            return acc;
        }, {});

        setUsers(userMap);
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
                product_type: "kit",
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
        return price * (1 - (discount / 100));
    };

    const handleRatingFilter = (rating) => {
        setSelectedRating(rating === selectedRating ? null : rating);
        scrollRef.current?.scrollTo({ y: 700, animated: true });
    };

    const filteredReviews = selectedRating
        ? kit?.reviews?.filter(review => review.rating === selectedRating) || []
        : kit?.reviews || [];

    if (!kit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Fetching Kit Details...</Text>
            </View>
        );
    }

    const availableLabs = kit?.labs?.filter(lab => !lab.is_deleted) || [];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Kit Details</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CartUser')} style={styles.headerButton}>
                        <Icon name="shopping-cart" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} ref={scrollRef}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: kit.image_url }} style={styles.image} resizeMode="contain" />
                            <TouchableOpacity onPress={() => toggleFavorite(kit._id)} style={styles.favoriteIcon}>
                                <Icon name={favorites.includes(kit._id) ? 'heart' : 'heart-o'} size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.title}>{kit.name || "Kit Name Unavailable"}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.finalPrice}>
                                    ${newPriceAfterDiscount(kit.price, kit.discount).toFixed(2) || "N/A"}
                                </Text>
                                <Text style={styles.originalPrice}>${kit.price?.toFixed(2) || "N/A"}</Text>
                                <Text style={styles.discount}>-{(kit.discount) || 0}%</Text>
                            </View>
                            <Text style={styles.category}>{kit.category_name || "Category Unavailable"}</Text>
                            <Text style={styles.descriptionTitle}>Description:</Text>
                            <Text style={styles.description}>{kit.description || "No description available."}</Text>

                            <Text style={styles.labsTitle}>Recommended Labs:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                                {availableLabs.length > 0 ? (
                                    availableLabs.map((lab) => (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Detaillabs', { kitId: lab._id })}>

                                            <View key={lab._id} style={styles.labItem}>
                                                <Text style={styles.labTitle}>{lab.name}</Text>
                                                <Text style={styles.labDescription}>{lab.description}</Text>
                                                <Text style={styles.labPrice}>Price: ${lab.price.toFixed(2)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={styles.noLabsText}>No available labs.</Text>
                                )}
                            </ScrollView>

                            {/* Star Rating Filter */}
                            <Text style={styles.filterTitle}>Filter by Rating:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                                <TouchableOpacity
                                    style={[
                                        styles.ratingButton,
                                        selectedRating === null && styles.selectedRatingButton
                                    ]}
                                    onPress={() => handleRatingFilter(null)}
                                >
                                    <Text style={styles.ratingButtonText}>All Stars</Text>
                                </TouchableOpacity>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <TouchableOpacity
                                        key={star}
                                        style={[
                                            styles.ratingButton,
                                            selectedRating === star && styles.selectedRatingButton
                                        ]}
                                        onPress={() => handleRatingFilter(star)}
                                    >
                                        <Text style={styles.ratingButtonText}>{star} Star</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Reviews Section */}
                            <View style={styles.reviewContainerFull}>
                                <Text style={styles.reviewsTitle}>Reviews:</Text>
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((review) => (
                                        <View key={review._id} style={styles.reviewContainer}>
                                            <Text style={styles.reviewComment}>Author: {users[review.user_id] || "Unknown User"}</Text>
                                            <StarRating rating={review.rating} />
                                            <Text style={styles.reviewComment}>{review.comment || "No comment."}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noReviewsText}>No reviews available.</Text>
                                )}
                            </View>
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
        flex: 1,
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
    contentContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
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
        fontSize: 20,
        fontWeight: 'bold',
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
        color: '#555555',
        marginBottom: 8,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    description: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 16,
    },
    labsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    horizontalScrollView: {
        marginBottom: 16,
    },
    labItem: {
        width: 200,
        marginRight: 16,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    labTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    labDescription: {
        fontSize: 14,
        color: '#555555',
        marginVertical: 4,
    },
    labPrice: {
        fontSize: 14,
        color: '#FF6347',
        marginVertical: 4,
    },
    labLink: {
        fontSize: 14,
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    noLabsText: {
        fontSize: 14,
        color: '#FF6347',
        textAlign: 'center',
    },
    reviewsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    reviewContainer: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 8,
    },
    reviewContainerFull: {
        paddingBottom: 50
    },
    reviewComment: {
        fontSize: 14,
        color: '#333333',
        padding: 5
    },
    reviewRating: {
        fontSize: 12,
        color: '#888888',
        marginTop: 4,
    },
    noReviewsText: {
        fontSize: 14,
        color: '#FF6347',
        textAlign: 'center',
    },
    addToCartButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 16,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    addToCartText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    horizontalScrollView: {
        marginTop: 10,
        marginBottom: 20,
    },
    ratingButton: {
        padding: 10,
        marginRight: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        color: "#fff"
    },
    selectedRatingButton: {
        backgroundColor: 'green',
    },
    ratingButtonText: {
        fontSize: 14,
        color: "#fff"
    },
});

export default Detailkits;




