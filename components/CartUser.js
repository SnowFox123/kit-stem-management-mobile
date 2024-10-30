import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { getCart } from '../service/UserServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const CartUser = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);

        const payload = {
            searchCondition: {
                is_deleted: false,
                product_id: "",
                status: ""
            },
            pageInfo: {
                pageNum: 1,
                pageSize: 10
            }
        };

        try {
            const response = await getCart(payload);
            if (response.data?.pageData) {
                // Filter only items with status 'new'
                const newItems = response.data.pageData.filter(item => item.status === 'new');
                setCartItems(newItems);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setError("Failed to load cart items.");
            Toast.show({
                text1: 'Error',
                text2: 'Failed to load cart items. Please try again later.',
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.product_image }} style={styles.itemImage} />
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.finalPrice}>${item.price_paid ? item.price_paid.toFixed(2) : 'N/A'}</Text>
                    <Text style={styles.originalPrice}>${item.price ? item.price.toFixed(2) : 'N/A'}</Text>
                    <Text style={styles.discount}><Text style={{ color: 'red' }}>{item.discount ? item.discount * 100 : 0}%</Text></Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Loading Cart...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Icon name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
            </View>

            {cartItems.length > 0 ? (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }} // Optional: Adds padding to the bottom
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgb(0, 110, 173)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        position: 'absolute',
        left: '48%',
    },
    headerButton: {
        padding: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    originalPrice: {
        fontSize: 16,
        color: '#ccc',
        textDecorationLine: 'line-through',
        marginHorizontal: 8,
    },
    finalPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: 'rgb(0, 110, 173)',
    },
    discount: {
        fontSize: 14,
        color: '#FF424E',
        fontWeight: 'bold',
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 1,
        alignSelf: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        // Updated shadow styles for both iOS and Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4, // This is the Android equivalent for shadows
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTextContainer: {
        flex: 1,
        paddingLeft: 20,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#FF6347',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CartUser;
