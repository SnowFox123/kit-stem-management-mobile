import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { axiosInstance } from '../service/customize-axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

function EditProfile() {
	const navigation = useNavigation();
	const [userProfile, setUserProfile] = useState(null);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const storedUser = await AsyncStorage.getItem('currentUser');
				if (storedUser) {
					setUserProfile(JSON.parse(storedUser));
				}
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		};
		fetchUserProfile();
	}, []);

	const handleUpdatePassword = async () => {
		if (!oldPassword || !newPassword) {
			Alert.alert('Error', 'Both fields are required.');
			return;
		}

		if (userProfile) {
			try {
				const updatedProfile = {
					user_id: userProfile._id,
					old_password: oldPassword,
					new_password: newPassword
				};

				// Send password update request to the API
				const response = await axiosInstance.put(`/users/change-password`, updatedProfile);

				if (response.success) {
					console.log('====================================');
					console.log('here');
					console.log('====================================');
					// Optionally, update AsyncStorage with the new profile data
					await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));

					Toast.show({
						position: 'top',
						type: 'success',
						text1: 'Password updated successfully',
						text2: 'You will be logged out and redirected to the login screen.',
						visibilityTime: 2000,
						autoHide: true,
					});
					navigation.goBack();
				}
			} catch (error) {
				console.error('Error updating password:', error);
				Alert.alert('Error', 'Failed to update password. Please try again.');
			}
		} else {
			Alert.alert('Error', 'User profile not found.');
		}
	};

	return (
		<View style={styles.container}>



			<Text style={styles.label}>Old Password</Text>
			<TextInput
				value={oldPassword}
				onChangeText={setOldPassword}
				style={styles.input}
				placeholder="Enter old password"
				secureTextEntry
			/>

			<Text style={styles.label}>New Password</Text>
			<TextInput
				value={newPassword}
				onChangeText={setNewPassword}
				style={styles.input}
				placeholder="Enter new password"
				secureTextEntry
			/>

			<TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
				<Text style={styles.buttonText}>Update Password</Text>
			</TouchableOpacity>
		</View>
	)
}

export default EditProfile

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 15,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '600',
		marginLeft: 15,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		marginBottom: 20,
		textAlign: 'center',
	},
	label: {
		fontWeight: 'bold',
		fontSize: 18,
		marginVertical: 8,
	},
	input: {
		backgroundColor: '#f5f5f5',
		padding: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#ddd',
		marginBottom: 12,
	},
	updateButton: {
		backgroundColor: '#4CAF50',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 20,
	},
	buttonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 18,
	},
})
