import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getLabs } from '../service/UserServices';

const LabsScreen = () => {
    const [data, setData] = useState([]);
    const [filteredLabs, setFilteredLabs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
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
                searchCondition: { keyword: "", category_id: "", status: "new", is_deleted: false },
                pageInfo: { pageNum: 1, pageSize: 100 }
            };
            const response = await getLabs(payload);
            const validData = response.data.pageData.filter(item => !item.is_deleted && item.status === "new");
            setData(validData);
            setFilteredLabs(validData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterByCategory = (category) => {
        setSelectedCategory(category);
        setFilteredLabs(category === 'All'
            ? data.filter(item => item.status === "new")
            : data.filter(item => item.category_name === category && item.status === "new" && !item.is_deleted)
        );
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


    const toggleFavorite = async (id) => {
        const updatedFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favoriteslabs', JSON.stringify(updatedFavorites));
    };

    const filterBySearch = () => {
        const lowercaseQuery = searchQuery.toLowerCase();
        setFilteredLabs(data.filter(item => item.name.toLowerCase().includes(lowercaseQuery) && !item.is_deleted));
    };

    const renderItem = ({ item }) => {
        const discountedPrice = item.discount
            ? (item.price * (1 - item.discount / 100)).toFixed(2)  // Divide discount by 100
            : item.price.toFixed(2);


        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Detaillabs', { kitId: item._id })}
                style={styles.card}
            >
                {/* <Image
                    source={{ uri: item.lab_url }}
                    style={styles.cardImage}
                    resizeMode="contain"
                /> */}
                <Image
                    source={require('../assets/LAB-1.jpg')}
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

                <View style={{ padding: 10 }}>
                    <Text style={styles.artName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                    {/* <View style={styles.ratingContainer}>
                        <Icon name="star" size={14} color="#FFD700" />
                        <Text style={styles.averageRating}>Rating: {item.rating || 'N/A'}</Text>
                    </View> */}
                    <View style={styles.priceGroup}>
                        <Text style={styles.price}>${discountedPrice}</Text>
                        {item.discount > 0 && (
                            <Text style={styles.oldPrice}>${item.price.toFixed(2)}</Text>
                        )}
                    </View>
                    <View style={styles.categorySoldContainer}>
                        <Text style={styles.brand}>{item.category_name}</Text>
                        <Text style={styles.brand}>{item.quantity}</Text>
                        <Text style={styles.soldText}>Max Support: {item.max_support_count || ''}</Text>
                        {/* <Text style={styles.soldText}>Max Support: {item.status}</Text> */}
                    </View>
                </View>

                <View style={styles.discountPosition}>
                    {item.discount > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={{ color: 'rgb(0, 110, 173)', fontWeight: '400' }}>
                                {item.discount}%
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredLabs(data);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by labs name..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={() => {
                        filterBySearch();
                        Keyboard.dismiss();
                    }}
                    returnKeyType="search"
                />
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    searchContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingRight: 40, // Add padding for the clear button
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: '25%',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        height: 40,
    },
    categoryButton: {
        padding: 7.5,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCategoryButton: {
        backgroundColor: 'rgb(0, 110, 173)',
    },
    categoryText: {
        fontSize: 14,
        color: '#000',
    },
    categoryTextActive: {
        color: '#fff',
    },
    card: {
        width: '48%',
        marginBottom: 10,
        marginHorizontal: '1%', // Adjusts spacing between columns
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    artName: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    averageRating: {
        marginLeft: 5,
    },
    priceGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        color: 'grey',
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'rgb(0, 110, 173)',
        marginRight: 5,
    },
    brand: {
        marginTop: 5,
        fontStyle: 'italic',
    },
    soldText: {
        marginTop: 5,
        color: 'grey',
    },
    discountPosition: {
        position: 'absolute',
        top: 1,
        left: 1
    },
    discountBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 1,
        alignSelf: 'center',
    },
    discountText: {
        color: '#fff',
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: 'rgb(0, 110, 173)',
    },
});

export default LabsScreen;
