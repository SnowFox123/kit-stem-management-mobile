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

const HomeScreen = () => {
    const navigation = useNavigation(); // Initialize navigation
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);

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

            {/* Test */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <Tag
                            key={category._id}
                            name={category.name}
                        />
                    ))
                ) : (
                    <Text>No Category available.</Text>
                )}
            </ScrollView>
            {/* End Test */}

            {/* Our BLogs */}
            <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '700' }}>Our Blogs</Text>
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
        position: 'absolute', // Absolute positioning to move to the right
        right: 16, // Adjust this value to position icons further or closer to the edge
    },
    icon: {
        marginLeft: 16, // Space between icons
        fontSize: 20,
    },
    logo: {
        width: 200, // Adjust as needed
        height: 100, // Adjust as needed
        alignSelf: 'center', // Center logo
        justifyContent: 'center',
        position: 'absolute', // Positioning the logo absolutely
        left: '50%', // Move to the center horizontally
        transform: [{ translateX: -100 }], // Offset the logo to the left by half of its width
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
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        height: 500
    }
});

export default HomeScreen;
