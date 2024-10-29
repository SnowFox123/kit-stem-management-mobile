import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from './component/avatar';
import Icon from "react-native-vector-icons/FontAwesome";

const Profile = () => {

    const [userProfile, setUserProfile] = useState(null);

    const getCurrentProfile = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser !== null) {
                setUserProfile(JSON.parse(currentUser));
            }
        } catch (error) {
            console.error('Error retrieving user profile from AsyncStorage:', error);
        }
    }

    useEffect(() => {
        getCurrentProfile();
    }, [])

    if (!userProfile) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    const formattedDob = dayjs(userProfile.dob).format('DD/MM/YYYY'); // Format: e.g., October 29, 2024


    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={{ fontSize: 30, marginBottom: 20, textAlign: 'center', fontWeight: '600' }}>Your Profile</Text>

                <View style={styles.avatar}>
                    {userProfile.avatar || <Avatar name={userProfile.name} />}
                </View>

                <Text style={styles.label}>ID</Text>
                <View style={styles.inputField}>
                    <Text style={styles.value}>{userProfile._id}</Text>
                </View>

                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputField}>
                    <Icon name="phone" size={20} color="#000" style={styles.icon} />
                    <Text style={styles.value}>{userProfile.phone_number}</Text>
                </View>

                <Text style={styles.label}>Your Email</Text>
                <View style={styles.inputField}>
                    <Icon name="envelope" size={20} color="#000" style={styles.icon} />
                    <Text style={styles.value}>{userProfile.email}</Text>
                </View>

                <Text style={styles.label}>Name</Text>
                <View style={styles.inputField}>
                    <Text style={styles.value}>{userProfile.name}</Text>
                </View>

                <Text style={styles.label}>Description</Text>
                <View style={styles.inputField}>
                    <Text style={styles.value}>{userProfile.description}</Text>
                </View>

                <Text style={styles.label}>Date Create Account</Text>
                <View style={styles.inputField}>
                    <Text style={styles.value}>{formattedDob}</Text>
                </View>

                <Pressable style={styles.logoutButton}>
                    <Text style={{ color: '#000000', fontWeight: '500', fontSize: 24 }}>Logout</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    avatar: {
        margin: 'auto',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        height: '100%',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 8,
    },
    inputField: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    value: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 10,
    },
    icon: {
        marginRight: 5,
    },
    logoutButton: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderColor: '#feb8f6',
        borderWidth: 1,
        justifyContent: 'center',
    }
});
