import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { getKit } from '../service/UserServices';

const HomeScreen2 = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const payload = {
        searchCondition: {
            keyword: "",
            category_id: "",
            status: "",
            is_deleted: false
        },
        pageInfo: {
            pageNum: 1,
            pageSize: 10
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getKit(payload);
                setData(result.data.pageData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            {/* <Image source={{ uri: item.image_url }} style={styles.image} /> */}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>Price: ${item.price} (Discount: {item.discount}%)</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
        </View>
    );

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderCard}
            numColumns={2} // Set to 2 columns for 2 items per row
            columnWrapperStyle={styles.row} // Additional styling for row alignment
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 8,
        backgroundColor: '#f9f9f9',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').width / 2 - 32, // Adjust height to maintain aspect ratio
        borderRadius: 8,
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    price: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        color: '#007bff',
        marginBottom: 4,
    },
});

export default HomeScreen2;
