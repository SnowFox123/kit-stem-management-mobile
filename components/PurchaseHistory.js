import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPurchase } from '../service/UserServices';

const PurchaseHistory = () => {
    const [status, setStatus] = useState('processing'); // Default status state
    const [cartItems, setCartItems] = useState([]); // State to hold cart items

    const handleStatusChange = async (newStatus) => {
        try {
            setStatus(newStatus); // Update local status state
            const payload = {
                searchCondition: {
                    is_deleted: false,
                    product_id: "",
                    status: newStatus,
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                },
            };
            const response = await getPurchase(payload); // Fetch data based on selected status

            if (response.success) {
                setCartItems(response.data.pageData); // Set cart items from the response
            } else {
                console.error("Error fetching cart data:", response);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.product_image }} style={styles.productImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <Text style={styles.productPrice}>Price: {item.price_paid} đ</Text>
                <Text style={styles.productDiscount}>Discount: {(item.discount)}%</Text>
                {/* Hide delivery info if the status is 'delivered' */}
                {status !== 'new' && (
                    <Text style={styles.productPrice}>Delivery by {item.staff_name}</Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Status Tags */}
            <View style={styles.statusContainer}>
                <TouchableOpacity
                    style={[styles.statusTag, status === 'new' && styles.activeStatus]}
                    onPress={() => handleStatusChange('new')}
                >
                    <Icon name="hourglass-top" size={20} color="#FF9800" />
                    <Text style={styles.statusText}>New</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.statusTag, status === 'processing' && styles.activeStatus]}
                    onPress={() => handleStatusChange('processing')}
                >
                    <Icon name="autorenew" size={20} color="#F44336" />
                    <Text style={styles.statusText}>Processing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.statusTag, status === 'delivering' && styles.activeStatus]}
                    onPress={() => handleStatusChange('delivering')}
                >
                    <Icon name="local-shipping" size={20} color="#03A9F4" />
                    <Text style={styles.statusText}>In Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.statusTag, status === 'delivered' && styles.activeStatus]}
                    onPress={() => handleStatusChange('delivered')}
                >
                    <Icon name="check-circle" size={20} color="#4CAF50" />
                    <Text style={styles.statusText}>Delivered</Text>
                </TouchableOpacity>
            </View>

            {/* Cart Items List */}
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// Styles remain unchanged



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    statusTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
    },
    activeStatus: {
        backgroundColor: '#B0BEC5',
    },
    statusText: {
        marginLeft: 5,
        fontSize: 14,
    },
    listContainer: {
        paddingVertical: 10,
    },
    cartItem: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    itemDetails: {
        marginLeft: 10,
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: '#333',
    },
    productDiscount: {
        fontSize: 12,
        color: '#FF9800',
    },
});

export default PurchaseHistory;
