import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { axiosInstance } from '../service/customize-axios'; // Assume you have axios configured
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

function ForgotPasswordScreen({ navigation }) {
	const [email, setEmail] = useState('');

	const handlePasswordReset = async () => {
		if (!email) {
			Toast.show(
				{
					type: 'error',
					position: 'top',
					text1: 'Error',
					text2: 'Please enter your email address.',
					visibilityTime: 3000,
					autoHide: true,
				}
			);
			return;
		}

		try {
			// Make a request to your backend API to initiate the password reset
			const response = await axiosInstance.put('/auth/forgot-password', { email });

			if (response.success) {
				// Show a success toast message
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Password Reset Email Sent',
					text2: 'Please check your email for further instructions.',
					visibilityTime: 3000,
					autoHide: true,
				});

				// Optionally, navigate back to the login screen
				navigation.navigate('Login');
			}
		} catch (error) {
			console.error('Error sending password reset email:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Error',
				text2: error.response.data.message,
				visibilityTime: 3000,
				autoHide: true,
			})
		}
	};

	return (
		<View style={styles.container}>

			<Text style={styles.title}>Reset Your Password</Text>

			<Text style={styles.label}>Email Address</Text>
			<TextInput
				value={email}
				onChangeText={setEmail}
				style={styles.input}
				placeholder="Enter your email"
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
				<Text style={styles.buttonText}>Send Reset Link</Text>
			</TouchableOpacity>
		</View>
	);
}

export default ForgotPasswordScreen;

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
	resetButton: {
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
});
