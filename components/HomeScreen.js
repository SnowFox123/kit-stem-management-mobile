import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icons from FontAwesome
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView from the new library
import { getBlogs } from '../service/blogService';
import BlogCard from './component/card';
import { getAllCategories } from '../service/categoryService';
import Tag from './component/tag';
import { getKit } from '../service/UserServices';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [kit, setKit] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            console.log('====================================');
            console.log("category", response);
            console.log('====================================');
            setCategories(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchKits = async () => {
        try {
            const response = await getKit(
                {
                    searchCondition: {
                        keyword: "",
                        category_id: "",
                        status: "",
                        is_deleted: false
                    },
                    pageInfo: {
                        pageNum: 1,
                        pageSize: 2
                    }
                });
            console.log(response);
            setKit(response.data.pageData);
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    }

    const fetchBlogs = async () => {
        try {
            const response = await getBlogs();
            console.log('====================================');
            console.log("response: ", response.data);
            console.log('====================================');
            setBlogs(response.data.pageData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
        fetchKits();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/63517e79bdf94bc8daa1bf18/0x0.png' }} // Replace with your logo URL
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => navigation.navigate('Login')} // Navigate to Login on press
                    >
                        <Icon name="user" size={30} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => navigation.navigate('Cart')} // Navigate to Cart on press
                    >
                        <Icon name="shopping-cart" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Main content goes here */}


            {/* Featured Kits */}
            <Text style={{ marginTop: 20, fontSize: 21, alignSelf: 'center', fontWeight: '600' }}>Featured STEM Kits</Text>
            {/* Kit name, description, level, image, start, detail button */}
            <ScrollView horizontal={true} contentContainerStyle={styles.recommendedKits} showsHorizontalScrollIndicator={false}>
                {kit.map((kit) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Detailkits', { kitId: kit._id })}
                        style={styles.card}
                        key={kit._id}
                    >
                        {/* card image */}
                        <Image
                            source={{ uri: kit.image_url }}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        {/* end card image */}
                        <View style={{ padding: 10 }}>
                            {/* kit name */}
                            <Text style={styles.cardContent} numberOfLines={2}>{kit.name}</Text>

                            <View style={styles.cardRating}>
                                <Icon name="star" size={24} color="#FFD700" />
                                <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 6 }}>sao</Text>
                            </View>
                            {/* end kit name */}
                            <View style={styles.cardCategory}>
                                <Text style={styles.cardCategory}>{kit.category_name}</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* End Featured Kits */}



            {/* Our BLogs */}
            <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: '700' }}>Our Blogs</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewStyle} showsHorizontalScrollIndicator={false}>
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <BlogCard
                            key={blog._id}
                            title={blog.title}
                            user_name={blog.user_name}
                            category_name={blog.category_name}
                            description={blog.description}
                            image_url={blog.image_url}
                            created_at={blog.created_at}
                        />
                    ))
                ) : (
                    <Text>No blogs available.</Text>
                )}
            </ScrollView>
            {/* End Our BLogs */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: '#fff',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 16,
    },
    icon: {
        marginLeft: 16,
        fontSize: 20,
    },
    logo: {
        width: 200,
        height: 100,
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -100 }],
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollViewStyle: {
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        height: 400,
    },
    recommendedKits: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    card: {
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        elevation: 2,
        marginRight: 16,
        marginBottom: 20,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    cardCategory: {
        fontSize: 14,
        fontWeight: '500',
    },
    cardRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
});

export default HomeScreen;
