import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icons from FontAwesome
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView from the new library

const HomeScreen = () => {
    const navigation = useNavigation(); // Initialize navigation

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
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
            </View>
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
});

export default HomeScreen;
