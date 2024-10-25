import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Detailarttool = ({ route }) => {
    const { arttoolId } = route.params;
    console.log(arttoolId)
    const [arttool, setArttool] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [comments, setComments] = useState([]);
    const [ratingFilter, setRatingFilter] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        fetchArttoolDetails();
        loadFavorites();
    }, []);

    const fetchArttoolDetails = async () => {
        try {
            const response = await axios.get(`https://67038b11ab8a8f892730864a.mockapi.io/art/${arttoolId}`);
            setArttool(response.data);
            setComments(response.data.comment || []);
        } catch (error) {
            console.error("Error fetching art tool details: ", error);
        }
    };

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites !== null) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Error loading favorites: ", error);
        }
    };

    const toggleFavorite = async (id) => {
        const updatedFavorites = favorites.includes(arttoolId)
            ? favorites.filter(id => id !== arttoolId)
            : [...favorites, arttoolId];

        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        Toast.show({
            text1: favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites',
            position: 'top',
            type: 'success',
            visibilityTime: 2000,
            autoHide: true,
        });
    };

    const newPriceAfterDiscount = (price, limitedTimeDeal) => {
        return price * (1 - limitedTimeDeal);
    }

    const calculateAverageRating = () => {
        if (comments.length === 0) return 0;

        const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
        return (totalRating / comments.length).toFixed(1);
    };

    const renderRatingStars = (averageRating) => {
        const fullStars = Math.floor(averageRating);
        const halfStar = averageRating % 1 !== 0;

        return (
            <View style={styles.starContainer}>
                {Array(fullStars).fill().map((_, index) => (
                    <Icon key={index} name="star" size={16} color="#FFD700" />
                ))}
                {halfStar && <Icon name="star-half-o" size={16} color="#FFD700" />}
                {Array(5 - Math.ceil(averageRating)).fill().map((_, index) => (
                    <Icon key={index + fullStars + (halfStar ? 1 : 0)} name="star-o" size={16} color="#FFD700" />
                ))}
            </View>
        );
    };

    const handleWatchMore = () => {
        navigation.navigate('AllComments', { comments });
    };

    const filterCommentsByRating = (rating) => {
        setRatingFilter(rating);
    };

    const prepareData = () => {
        const data = [{ type: 'arttool' }];

        const sortedComments = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));

        const commentsData = sortedComments
            .filter(comment => ratingFilter === 0 || comment.rating === ratingFilter)
            .slice(0, 2)
            .map(comment => ({
                type: 'comment',
                id: comment.id || `${comment.author}-${comment.date}`,
                rating: comment.rating,
                comment: comment.feedback,
                author: comment.author,
                date: comment.date,
                authorImage: comment.authorImage,
                feedback: comment.feedback
            }));

        return [...data, ...commentsData];
    };

    const renderArtToolDetails = () => {
        const averageRating = calculateAverageRating();

        return (
            <View>
                <Swiper style={styles.wrapper} showsButtons={false} autoplay={false} paginationStyle={{ bottom: 10 }}>
                    <View style={styles.slide}>
                        <Image source={{ uri: arttool.image }} style={styles.image} />
                    </View>
                </Swiper>
                <TouchableOpacity style={styles.img_quantity}>
                    <Text style={styles.pageBorder}> 1/1 </Text>
                </TouchableOpacity>

                {/* Updated Price Section */}
                <View style={styles.priceContainer}>
                    <View style={styles.priceGroup}>
                        {arttool.limitedTimeDeal > 0 ? (
                            // Hiển thị cả giá khuyến mãi và giá gốc khi có khuyến mãi
                            <>
                                <Text style={styles.price}>
                                    ${newPriceAfterDiscount(arttool.price, arttool.limitedTimeDeal).toFixed(2)}
                                </Text>
                                <Text style={styles.oldPrice}>
                                    ${arttool.price.toFixed(2)}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.price}>
                                ${arttool.price.toFixed(2)}
                            </Text>
                        )}
                    </View>

                    <View style={styles.selling}>
                        <Text style={styles.sellingText}>Selling: 306</Text>
                        <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(arttool.id)}>
                            <Icon style={{ marginLeft: 7 }} name={favorites.includes(arttoolId) ? 'heart' : 'heart-o'} size={14} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.title}>{arttool.artName}</Text>
                <View style={styles.brandContainer}>
                    <Image source={{ uri: arttool.brandImage }} style={styles.brandImage} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.brandName}>{arttool.brandName}</Text>
                        <Text style={{ fontSize: 14, marginTop: 2, color: '#777' }}>Online 7 minutes ago</Text>
                        <View style={{ flexDirection: 'row', marginTop: 2 }}>
                            <Icon name='map-marker' size={14} style={{ marginRight: 5, color: '#777' }}></Icon>
                            <Text style={{ fontSize: 14, color: '#777' }}>International</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 78 }}>
                        <Text style={styles.watchShop}> Watch Shop </Text>
                    </View>
                </View>

                <Text style={styles.descriptionTitle}>Description:</Text>
                <Text style={styles.description}>{arttool.description}</Text>
                <View style={{ marginTop: 1, marginBottom: 5 }}>
                    <Text style={styles.descriptionTitle}>
                        Glass Surface: <View
                            style={[
                                styles.tag,
                                arttool.glassSurface ? styles.availableTag : styles.unavailableTag
                            ]}
                        >
                            <Text style={styles.tagText}>
                                {arttool.glassSurface ? "Available" : "Not Available"}
                            </Text>
                        </View>
                    </Text>
                </View>


                <Text style={styles.descriptionTitle}>Average Rating:</Text>

                <View style={styles.row}>
                    {renderRatingStars(parseFloat(averageRating))}
                    <Text style={styles.averageRatingText}> {averageRating} / 5</Text>
                    <Text style={styles.averateComments}>({comments.length} comments) </Text>
                </View>
            </View>
        );
    };


    const renderItem = ({ item }) => {
        if (item.type === 'arttool') {
            return renderArtToolDetails();
        } else if (item.type === 'comment') {
            return (
                <View style={styles.commentContainer}>
                    <Image source={{ uri: item.authorImage }} style={styles.commentAuthorImage} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 14, fontWeight: '500' }}>{item.author}</Text>
                        <View style={styles.commentRating}>
                            {Array(item.rating).fill().map((_, index) => (
                                <Icon key={index} name="star" size={14} color="#FFD700" />
                            ))}
                        </View>
                        <Text style={styles.commentText}>{item.feedback}</Text>
                        <Text style={styles.commentText}>
                            {`${new Date(item.date).toLocaleDateString('vi', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })} ${new Date(item.date).toLocaleTimeString('vi', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })}`}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.watchMore}
                        onPress={handleWatchMore}
                    >
                        <Text style={{ color: 'grey' }}>Watch More</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    if (!arttool) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Fetching Art Tool Details...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={prepareData()}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.type === 'arttool' ? 'arttool' : item.id.toString()}
                    />

                    {/* Modal and other components can remain as they are */}
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    brand: {
        fontSize: 18,
        color: '#777',
        marginBottom: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 3
    },
    priceGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 22,
        fontWeight: '500',
        color: '#FF6347',
    },
    oldPrice: {
        fontSize: 16,
        color: 'grey',
        textDecorationLine: 'line-through',
        marginLeft: 5,
        fontWeight: '300',
        marginTop: 5,
    },
    selling: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellingText: {
        fontSize: 14,
        color: '#333',
    },
    favoriteButton: {
        // Adjust the position if needed
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#555',
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        lineHeight: 24,
    },
    glassSurface: {
        fontSize: 16,
        color: '#333',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#777',
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    commentContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        position: 'relative',
        flexDirection: 'row'
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '400',
        marginBottom: 5,
        marginTop: 2
    },
    commentRating: {
        flexDirection: 'row',
        marginTop: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    buttonMargin: {
        marginRight: 20,
    },
    averageRatingText: {
        fontSize: 14,
        color: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        marginLeft: 3,
        color: '#FF6347'
    },
    tag: {
        marginLeft: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: -6,
    },
    availableTag: {
        backgroundColor: 'green', // Color for available state
    },
    unavailableTag: {
        backgroundColor: 'red', // Color for unavailable state
    },
    tagText: {
        color: 'white',
        fontWeight: 'bold',
    },
    // New Styles for Brand Section
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    brandImage: {
        width: 50,
        height: 50,
        borderRadius: 30,
        marginRight: 10,
    },
    commentAuthorImage: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginRight: 10,
    },
    brandName: {
        fontSize: 18,
    },
    watchShop: {
        borderWidth: 1,
        borderColor: '#FF6347',
        padding: 6,
        borderRadius: 5,
        color: '#FF6347'
    },
    img_quantity: {
        position: 'absolute',
        top: 270,
        right: 1,
        zIndex: 1,
    },
    wrapper: { height: 300 },
    slide: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    pageBorder: {
        borderWidth: 0.5,
        borderRadius: 50,
        padding: 2,
        borderColor: '#ccc',
        paddingLeft: 4
    },
    averateComments: {
        marginLeft: 8,
        marginBottom: 17,
        color: 'grey',
        fontWeight: '400'
    },
    watchMore: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    }
})


export default Detailarttool;
