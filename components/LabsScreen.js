import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getLabs } from '../service/UserServices';
import { WebView } from 'react-native-webview';

const LabsScreen = () => {
    const [data, setData] = useState([]);
    const [filteredLabs, setFilteredLabs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const searchInputRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchData();
        loadFavorites();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
            loadFavorites();
        }, [])
    );

    useEffect(() => {
        if (data.length > 0) {
            extractCategories(data);
            filterByCategory(selectedCategory);
        }
    }, [data, selectedCategory]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const payload = {
                searchCondition: { keyword: "", category_id: "", status: "", is_deleted: false },
                pageInfo: { pageNum: 1, pageSize: 100 }
            };
            const response = await getLabs(payload);
            const validData = response.data.pageData.filter(item => !item.is_deleted);
            setData(validData);
            setFilteredLabs(validData);
        } catch (error) {
            console.error("Error fetching data: ", error);
            Toast.show({
                text1: 'Error fetching data',
                position: 'top',
                type: 'error',
                visibilityTime: 2000,
                autoHide: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteslabs');
            setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
        } catch (error) {
            console.error("Error loading favorites: ", error);
        }
    };

    const formatDiscount = (discount) => `${(discount * 100).toFixed(0)}%`;

    const extractCategories = (data) => {
        const categoryList = ['All', ...new Set(data.map(item => item.category_name))];
        setCategories(categoryList.map(category => ({
            name: category,
            count: category === 'All' ? data.length : data.filter(item => item.category_name === category).length
        })));
    };

    const filterByCategory = (category) => {
        setSelectedCategory(category);
        setFilteredLabs(category === 'All'
            ? data
            : data.filter(item => item.category_name === category && !item.is_deleted)
        );
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

    const renderItem = ({ item }) => {
        const discountedPrice = item.discount
            ? (item.price * (1 - item.discount)).toFixed(2)
            : item.price.toFixed(2);

        return (
            <TouchableOpacity
                onPress={() => {
                    setVideoUrl(item.lab_url);
                    setModalVisible(true);
                }}
                style={styles.card}
            >
                <Image
                    source={{ uri: item.lab_url }} // Assuming the lab URL is an image
                    style={styles.cardImage}
                    resizeMode="contain"
                />
                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item._id)}>
                    <Icon
                        name={favorites.includes(item._id) ? 'heart' : 'heart-o'}
                        size={24}
                        color="red"
                    />
                </TouchableOpacity>
                <Text style={styles.artName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                <View style={styles.ratingContainer}>
                    <Icon name="star" size={14} color="#FFD700" />
                    <Text style={styles.averageRating}>Rating: {item.rating || 'N/A'}</Text>
                </View>
                <View style={styles.priceGroup}>
                    <Text style={styles.price}>${discountedPrice}</Text>
                    {item.discount > 0 && (
                        <Text style={styles.oldPrice}>${item.price.toFixed(2)}</Text>
                    )}
                </View>
                <View style={styles.categorySoldContainer}>
                    <Text style={styles.brand}>{item.category_name}</Text>
                    <Text style={styles.soldText}>Support: {item.max_support_count || ''}</Text>
                </View>
                <View style={styles.discountPosition}>
                    {item.discount > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={{ color: 'rgb(0, 110, 173)', fontWeight: '400' }}>
                                {formatDiscount(item.discount)}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        if (query) {
            setFilteredLabs(data.filter(item => item.name.toLowerCase().includes(query) && !item.is_deleted));
        } else {
            setFilteredLabs(data);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredLabs(data);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search by lab name..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                {searchQuery ? (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                        <Icon name="times-circle" size={20} color="grey" />
                    </TouchableOpacity>
                ) : null}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.name}
                        style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategoryButton]}
                        onPress={() => filterByCategory(category.name)}
                    >
                        <Text style={[styles.categoryText, selectedCategory === category.name && styles.categoryTextActive]}>
                            {category.name} ({category.count})
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="rgb(0, 110, 173)" />
                    <Text style={styles.loadingText}>Fetching Lab Details...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredLabs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            {/* Modal for Video Playback */}
            <Modal
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Icon name="times" size={30} color="black" />
                        </TouchableOpacity>
                        {videoUrl && (
                            <WebView
                                source={{ uri: videoUrl }}
                                style={{ flex: 1 }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles for modal and other components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: 'rgb(0, 110, 173)',
        padding: 10,
        borderRadius: 5,
    },
    searchButtonText: {
        color: '#fff',
    },
    clearButton: {
        marginLeft: 10,
    },
    categoryContainer: {
        paddingVertical: 10,
    },
    categoryButton: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    selectedCategoryButton: {
        backgroundColor: 'rgb(0, 110, 173)',
    },
    categoryText: {
        color: '#000',
    },
    categoryTextActive: {
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
    card: {
        flex: 1,
        margin: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#fff',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 120,
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    artName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    averageRating: {
        marginLeft: 5,
    },
    priceGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(0, 110, 173)',
    },
    oldPrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
        marginLeft: 10,
        color: '#999',
    },
    categorySoldContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    brand: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    soldText: {
        fontSize: 14,
        color: '#666',
    },
    discountPosition: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    discountBadge: {
        backgroundColor: '#f0c040',
        borderRadius: 5,
        padding: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

export default LabsScreen;
