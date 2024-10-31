import React, { useEffect, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';



const HomeScreen = () => {
    const navigation = useNavigation();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [kit, setKit] = useState([]);
    const [popularKits, setPopularKits] = useState([]);
    const background = require('../assets/be7b1af6feaa4d6eb03070ed50b26c29.mp4');
    const [userProfile, setUserProfile] = useState();

    const getCurrentUser = async () => {
        const currentUser = await AsyncStorage.getItem('currentUser');
        setUserProfile(currentUser);
    }

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
                        pageSize: 10
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
        getCurrentUser();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/63517e79bdf94bc8daa1bf18/0x0.png' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.iconContainer}>
                    {!userProfile ??
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Icon name="user" size={30} color="#000" />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => navigation.navigate('CartUser')} // Navigate to Cart on press
                    >
                        <Icon name="shopping-cart" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Featured STEM Kits */}
            <View style={styles.featuredSection}>
                <Text style={styles.sectionTitle}>Featured STEM Kits</Text>
                <ScrollView horizontal contentContainerStyle={styles.recommendedKits} showsHorizontalScrollIndicator={false}>
                    {kit.splice(0, 2).map((kit) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Detailkits', { kitId: kit._id })}
                            style={styles.card}
                            key={kit._id}
                        >
                            <Image
                                source={{ uri: kit.image_url }}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={{ padding: 10 }}>
                                <Text style={styles.cardContent} numberOfLines={2}>{kit.name}</Text>
                                <View style={styles.cardRating}>
                                    <Icon name="star" size={24} color="#FFD700" />
                                    <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 6 }}>sao</Text>
                                </View>
                                <Text style={styles.cardCategory}>{kit.category_name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Categories Section */}
            {/* <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                    {categories.map((category) => (
                        <Tag name={category.name} key={category._id} />
                    ))}
                </ScrollView>
            </View> */}

            <View style={styles.featuredSection}>
                <Text style={styles.sectionTitle}>New Kits & Popular Kits</Text>
                <ScrollView horizontal contentContainerStyle={styles.recommendedKits} showsHorizontalScrollIndicator={false}>
                    {kit.splice(0, 6).map((kit) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Detailkits', { kitId: kit._id })}
                            style={styles.card}
                            key={kit._id}
                        >
                            <Image
                                source={{ uri: kit.image_url }}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={{ padding: 10 }}>
                                <Text style={styles.cardContent} numberOfLines={1} ellipsizeMode="tail">{kit.name}</Text>
                                <View style={styles.cardRating}>
                                    <Icon name="star" size={24} color="#FFD700" />
                                    <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 6 }}>sao</Text>
                                </View>
                                <Text style={styles.cardCategory}>{kit.category_name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>


            {/* Our Blogs */}
            <Text style={styles.blogSectionTitle}>Our Blogs</Text>
            <ScrollView horizontal contentContainerStyle={styles.scrollViewStyle} showsHorizontalScrollIndicator={false}>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: '#fff',
    },
    logo: {
        width: 200,
        height: 100,
        alignSelf: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 16,
    },
    icon: {
        marginLeft: 16,
        fontSize: 20,
    },
    sectionTitle: {
        fontSize: 21,
        fontWeight: '600',
        alignSelf: 'center',
        marginVertical: 10,
    },
    featuredSection: {
        backgroundColor: '#fff',
        // paddingVertical: 10,
        marginBottom: 20,
    },
    recommendedKits: {
        paddingHorizontal: 10,
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
    cardContent: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    cardCategory: {
        fontSize: 14,
        fontWeight: '500',
    },
    categorySection: {
        marginBottom: 20,
    },
    categoryContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    scrollViewStyle: {
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        paddingBottom: 60,
    },
    blogSectionTitle: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 10,
    },
});

export default HomeScreen;
