import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCart } from '../service/UserServices';

const DeliveryStatus = () => {
    const [status, setStatus] = useState('waiting_paid'); // Default status state
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
            const response = await getCart(payload); // Fetch data based on selected status

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
                <Text style={styles.productPrice}>Price: {item.price} đ</Text>
                <Text style={styles.productPrice}>Price new: {item.price * (1 - (item.discount / 100))} đ</Text>
                <Text style={styles.productDiscount}>Discount: {(item.discount)}%</Text>
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
                    <Icon name="local-shipping" size={20} color="#03A9F4" />
                    <Text style={styles.statusText}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.statusTag, status === 'waiting_paid' && styles.activeStatus]}
                    onPress={() => handleStatusChange('waiting_paid')}
                >
                    <Icon name="hourglass-empty" size={20} color="#FF9800" />
                    <Text style={styles.statusText}>Waiting Payment</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.statusTag, status === 'cancel' && styles.activeStatus]}
                    onPress={() => handleStatusChange('cancel')}
                >
                    <Icon name="cancel" size={20} color="#F44336" />
                    <Text style={styles.statusText}>Cancelled</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.statusTag, status === 'completed' && styles.activeStatus]}
                    onPress={() => handleStatusChange('completed')}
                >
                    <Icon name="check-circle" size={20} color="#4CAF50" />
                    <Text style={styles.statusText}>Complete</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // paddingVertical: 10,
    },
    statusTag: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
    },
    activeStatus: {
        backgroundColor: '#B0BEC5',
    },
    statusText: {
        // marginLeft: 5,
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

export default DeliveryStatus;
