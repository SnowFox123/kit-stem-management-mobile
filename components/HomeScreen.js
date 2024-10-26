import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import axiosInstance from '../service/customize-axios';

import { getLab } from '../service/UserServices'; // Ensure the path is correct


const HomeScreen = () => {
    const [arttools, setArttools] = useState([]);
    const [filteredArttools, setFilteredArttools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [comments, setComments] = useState([]);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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
        if (arttools.length > 0) {
            extractCategories(arttools);
            filterByCategory(selectedCategory);
        }
    }, [arttools, selectedCategory]);

    if (!arttools) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Fetching Art Tool Details...</Text>
            </View>
        );
    }

    const payload = {
        searchCondition: {
            keyword: "", // Add a search term if needed
            category_id: "", // Add a category ID if needed
            status: "",
            is_deleted: false
        },
        pageInfo: {
            pageNum: 1,
            pageSize: 10
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getLab(payload);

            console.log(result.data.pageData)
            setArttools(result.data.pageData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    // const defaultPayload = {
    //     searchCondition: {
    //         keyword: "",
    //         category_id: "",
    //         status: "",
    //         is_deleted: false
    //     },
    //     pageInfo: {
    //         pageNum: 1,
    //         pageSize: 10
    //     }
    // };

    // Define fetchData function
    // const fetchData = async () => {
    //     try {
    //         const response = await axiosInstance.post('/kit/search', defaultPayload);

    //         console.log(response.data.pageData);
    //         // You can now uncomment the lines below to set your data
    //         setArttools(response.data.pageData);
    //         // setFilteredArttools(response.data.pageData);
    //         console.log(filteredArttools)
    //         // setComments(response.data.comment || []);
    //     } catch (error) {
    //         console.error("Error fetching data: ", error);
    //     }
    // };

    // const fetchData = async () => {
    //     try {
    //         const response = await axiosInstance.post('/kit/search', defaultPayload);

    //         console.log(response.data.pageData);
    //         // You can now uncomment the lines below to set your data
    //         // setArttools(response.data);
    //         // setFilteredArttools(response.data);
    //         // setComments(response.data.comment || []);
    //     } catch (error) {
    //         console.error("Error fetching data: ", error);
    //     }
    // };


    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(parsedFavorites);
        } catch (error) {
            console.error("Error loading favorites: ", error);
        }
    };
    const formatDiscount = (limitedTimeDeal) => {
        return limitedTimeDeal * 100 + '%'
    };

    const extractCategories = (arttools) => {
        const brandCount = arttools.reduce((acc, arttool) => {
            acc[arttool.brandName] = (acc[arttool.brandName] || 0) + 1;
            return acc;
        }, {});

        const categoryList = ['All', ...Object.keys(brandCount)];
        const categoryWithCounts = categoryList.map(category => ({
            name: category,
            count: category === 'All' ? arttools.length : brandCount[category],
        }));
        setCategories(categoryWithCounts);
    };

    const filterByCategory = (category) => {
        setSelectedCategory(category);
        let filteredData = arttools;

        if (category !== 'All') {
            filteredData = filteredData.filter(arttool => arttool.brandName === category);
        }

        setFilteredArttools(filteredData);
    };

    const toggleFavorite = async (id) => {
        const updatedFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];

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

    const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };

    const calculateAverageRating = (comments) => {
        if (!comments || comments.length === 0) return 0;
        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        return totalRating / comments.length;
    };


    const renderItem = ({ item, index }) => {
        // const averageRating = calculateAverageRating(item.comment);
        // const isLastItem = index === filteredArttools.length - 1;
        // const isOdd = filteredArttools.length % 2 !== 0;
        return (
            <>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Detailarttool', { arttoolId: item.id })}
                    style={styles.card}
                >
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
                        <Icon
                            name={favorites.includes(item.id) ? 'heart' : 'heart-o'}
                            size={24}
                            color="red"
                        />
                    </TouchableOpacity>
                    <Text style={styles.artName} numberOfLines={2}>
                        {truncateText(item.artName, 10)}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 15, gap: 8, marginLeft: 7 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Icon key={item.id} name="star" size={14} color="#FFD700" style={{ paddingBottom: 48 }} />
                            <Text style={[styles.averageRating]}>
                                {averageRating.toFixed(1)}
                            </Text>
                        </View>
                        <Text style={styles.brand}>{item.brandName}</Text>
                    </View>
                    <View style={styles.pricePosition}>
                        <View style={styles.priceGroup}>
                            <Text style={styles.price}>
                                ${item.price.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.soldPosition}>
                        <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Sold 1,1k</Text>
                    </View>
                    <View style={styles.discountPosition}>
                        {item.limitedTimeDeal > 0 ? (
                            <View style={styles.discountBadge}>
                                <Text style={{ color: '#FF6347', fontWeight: '400' }}>{formatDiscount(item.limitedTimeDeal)}</Text>
                            </View>
                        ) : <></>}
                    </View>

                </TouchableOpacity >
                {isLastItem && isOdd && (
                    <View style={[styles.card, { backgroundColor: 'transparent', elevation: 0 }]} />
                )}</>
        );
    }

    const handleSearch = () => {
        filterByCategory(selectedCategory);
        if (searchQuery) {
            const filteredData = arttools.filter(arttool =>
                arttool.artName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredArttools(filteredData);
        } else {
            setFilteredArttools(arttools);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
        setSelectedCategory('All');
        setFilteredArttools(arttools);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query) {
            const newSuggestions = arttools.filter(arttool =>
                arttool.artName.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(newSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionPress = (item) => {
        setSearchQuery(item.artName);
        setFilteredArttools([item]); // Show the selected item only
        setSuggestions([]); // Clear suggestions
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search by art name..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    onKeyPress={({ nativeEvent }) => {
                        // Check if the enter key is pressed
                        if (nativeEvent.key === 'Enter') {
                            handleSearch(); // Call the search function
                        }
                        // Check if backspace is pressed
                        if (nativeEvent.key === 'Backspace') {
                            // Handle focusing; no need to call handleSearchChange again
                            if (searchInputRef.current) {
                                searchInputRef.current.focus(); // Keep focus on the input
                            }
                        }
                    }}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity style={styles.iconInsideInput} onPress={clearSearch}>
                        <Icon key={arttools.id} name="times-circle" size={20} color="grey" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>

            </View>

            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSuggestionPress(item)} style={styles.suggestionItem}>
                            <Text>{item.artName}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionList}
                />
            )}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToAlignment='start'
                snapToInterval={130}
                contentContainerStyle={styles.categoryContainer}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.name}
                        style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategoryButton]}
                        onPress={() => filterByCategory(category.name)}
                    >
                        <Text style={selectedCategory === category.name && styles.categoryTextActive}>{category.name} ({category.count})</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={filteredArttools}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 0,
        padding: 10,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    iconInsideInput: {
        position: 'absolute',
        right: 80, // Đặt biểu tượng gần cạnh phải của ô nhập liệu
    },
    searchButton: {
        paddingHorizontal: 10,
        backgroundColor: '#FF6347',
        borderRadius: 5,
        marginLeft: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 10,
        backgroundColor: 'grey',
        borderRadius: 20,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 14,
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
        backgroundColor: '#FF6347',
    },
    categoryText: {
        fontSize: 14,
        color: '#000',
    },
    categoryTextActive: {
        fontSize: 14,
        color: 'white',
    },
    card: {
        flex: 1,
        margin: 5,
        padding: 1,
        backgroundColor: '#f9f9f9',
        elevation: 3,
    },
    cardImage: {
        resizeMode: 'contain',
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    artName: {
        fontSize: 16,
        fontWeight: '400',
        marginTop: 2,
        marginLeft: 5,
        marginRight: 3
    },
    brand: {
        fontSize: 14,
        color: '#000',
        marginBottom: 40,
        marginTop: -10,
        fontWeight: '400'
    },
    averageRating: {
        fontSize: 14,
        color: '#000',
        fontWeight: '400',
        marginBottom: 40,
        marginTop: -10
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6347',
        marginBottom: 10,
    },
    discountBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 1,
        alignSelf: 'center',
    },
    dealText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    suggestionList: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 3,
        zIndex: 1,
    },
    suggestionItem: {
        padding: 10,
    },
    priceGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    oldPrice: {
        fontSize: 16,
        color: 'grey',
        textDecorationLine: 'line-through',
        marginLeft: 5,
        fontWeight: '300',
        marginBottom: 8
    },
    pricePosition: {
        position: 'absolute',
        bottom: 0,
        left: 10
    },
    soldPosition: {
        position: 'absolute',
        bottom: 13,
        right: 10
    },
    discountPosition: {
        position: 'absolute',
        top: 1,
        left: 1
    }
});

export default HomeScreen;
