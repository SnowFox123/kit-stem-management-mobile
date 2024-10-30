import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { getCart } from '../service/UserServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

const CartUser = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [editMode, setEditMode] = useState(false);
    const navigation = useNavigation();

    // Create a ref to manage Swipeable components
    const swipeableRefs = useRef(new Map());

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        const payload = {
            searchCondition: {
                is_deleted: false,
                product_id: '',
                status: 'new',
            },
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
            },
        };
    
        try {
            const response = await getCart(payload);
            const newItems = response.data?.pageData?.filter(item => item.status === 'new') || [];
    
            // Filter to keep only unique items based on `_id`
            const uniqueItems = Array.from(
                new Map(newItems.map(item => [item.product_id, item])).values()
            );
    
            setCartItems(uniqueItems);
        } catch (error) {
            setError('Failed to load cart items.');
            Toast.show({
                text1: 'Error',
                text2: 'Failed to load cart items. Please try again later.',
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    

    const toggleSelection = (id) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(id)) {
            newSelectedItems.delete(id);
        } else {
            newSelectedItems.add(id);
        }
        setSelectedItems(newSelectedItems);
    };

    const selectAll = () => {
        closeAllSwipeables();

        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set());
        } else {
            const allSelected = new Set(cartItems.map(item => item._id));
            setSelectedItems(allSelected);
        }
    };

    const deleteSelectedItems = () => {
        closeAllSwipeables();
        const updatedItems = cartItems.filter(item => !selectedItems.has(item._id));
        setCartItems(updatedItems);
        setSelectedItems(new Set());
    };

    const deleteItem = (id) => {
        closeAllSwipeables();
        const updatedItems = cartItems.filter(item => item._id !== id);
        setCartItems(updatedItems);
        Toast.show({
            text1: 'Item Deleted',
            text2: 'The item has been removed from your cart.',
            type: 'success',
            position: 'top',
            visibilityTime: 3000,
        });
    };

    const calculateTotalPrice = () => {
        let total = 0;
        selectedItems.forEach(id => {
            const item = cartItems.find(cartItem => cartItem._id === id);
            if (item) {
                total += item.price_paid || 0;
            }
        });
        return total.toFixed(2);
    };

    const handlePayment = () => {
        closeAllSwipeables();
        Toast.show({
            text1: 'Payment',
            text2: `Proceeding to payment for $${calculateTotalPrice()}`,
            type: 'success',
            position: 'top',
            visibilityTime: 3000,
        });
    };

    const renderCartItem = ({ item }) => {
        const rightSwipeActions = () => (
            <TouchableOpacity onPress={() => deleteItem(item._id)} style={styles.deleteButton2}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        );

        const closeSwipeable = () => {
            if (swipeableRefs.current.has(item._id)) {
                swipeableRefs.current.get(item._id).close();
            }
        };

        return (
            <Swipeable
                ref={ref => swipeableRefs.current.set(item._id, ref)} // Set the reference for this Swipeable
                renderRightActions={rightSwipeActions}
            // onSwipeableOpen={closeSwipeable} // Close when opened
            >
                <TouchableOpacity
                    onPress={() => {
                        // toggleSelection(item._id);
                        navigation.navigate('Detailkits', { kitId: item._id });
                        closeSwipeable(); // Close swipeable when interacting with the item
                    }}
                    style={[styles.cartItem, selectedItems.has(item._id) && styles.selectedCartItem]}
                >
                    <View>
                        <TouchableOpacity onPress={() => toggleSelection(item._id)} style={styles.checkboxContainer}>
                            <Icon
                                name={selectedItems.has(item._id) ? 'check-square' : 'square-o'}
                                size={24}
                                color={selectedItems.has(item._id) ? '#FF6347' : '#777'}
                            />
                        </TouchableOpacity>
                    </View>
                    <Image source={{ uri: item.product_image }} style={styles.itemImage} />
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemName}>{item.product_name}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.finalPrice}>${item.price_paid ? item.price_paid.toFixed(2) : 'N/A'}</Text>
                            <Text style={styles.originalPrice}>${item.price ? item.price.toFixed(2) : 'N/A'}</Text>
                            <Text style={styles.discount}>
                                <Text style={{ color: 'red' }}>{item.discount ? item.discount * 100 : 0}%</Text>
                            </Text>
                        </View>
                        <Text style={styles.itemName}>Quantity</Text>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    // Define closeAllSwipeables function
    const closeAllSwipeables = () => {
        swipeableRefs.current.forEach(ref => {
            ref.close(); // Close each swipeable
        });
    };

    if (loading) return <ActivityIndicator style={styles.loadingContainer} size="large" color="#FF6347" />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Icon name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
            </View>

            <View style={styles.buttonBar}>
                <TouchableOpacity onPress={selectAll} style={styles.barButton}>
                    <View style={styles.selectAllContainer}>
                        <Text style={styles.barButtonText}>
                            {selectedItems.size === cartItems.length ? 'Deselect All' : 'Select All'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setEditMode(!editMode);
                    closeAllSwipeables(); // Close all swipeables on edit mode toggle
                }} style={styles.barButton}>
                    <Text style={styles.barButtonText}>{editMode ? 'Cancel Edit' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

            {cartItems.length > 0 ? (
                <FlatList
                    style={{ padding: 20 }}
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty.</Text>
                </View>
            )}

            <View style={styles.totalContainer}>
                <TouchableOpacity onPress={selectAll} style={{ flexDirection: 'row' }}>
                    <Icon
                        name={selectedItems.size === cartItems.length ? 'check-square' : 'square-o'}
                        size={24}
                        color={selectedItems.size === cartItems.length ? '#FF6347' : '#777'}
                    />
                    <Text style={{ marginLeft: 10 }}>ALL</Text>
                </TouchableOpacity>
                {!editMode && (
                    <Text style={styles.totalText}>Total: ${calculateTotalPrice()}</Text>
                )}
                {editMode && (
                    <TouchableOpacity onPress={deleteSelectedItems} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete Selected</Text>
                    </TouchableOpacity>
                )}
                {!editMode && (
                    <TouchableOpacity onPress={handlePayment} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Payment</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Toast />
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
    buttonBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    barButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FF6347',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    barButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxContainer: {
        marginRight: 10,
        padding: 5,
    },
    selectedCartItem: {
        backgroundColor: '#e0e0e0',
    },
    originalPrice: {
        fontSize: 15,
        color: '#ccc',
        textDecorationLine: 'line-through',
        marginHorizontal: 8,
    },
    finalPrice: {
        fontSize: 17,
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
        paddingVertical: 16,
        paddingHorizontal: 5,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTextContainer: {
        flex: 1,
        paddingLeft: 20,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        resizeMode: 'cover',
        marginRight: 15,
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
    totalContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#FFF3E0',
        borderTopWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentButton: {
        backgroundColor: '#FF6347',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    paymentButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton2: {
        backgroundColor: '#FF424E',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});

export default CartUser;
