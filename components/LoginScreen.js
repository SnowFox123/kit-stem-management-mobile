import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { axiosInstance } from '../service/customize-axios';
import Toast from 'react-native-toast-message';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function LoginScreen() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigation();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [role, setRole] = useState('customer');
	const [isRegister, setIsRegister] = useState(false);

	const handleGetCurrentUser = async () => {
		console.log('Get current user');
		try {
			const response = await axiosInstance.get('/auth');
			console.log("Current user: " + response);

			await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));

		} catch (error) {
			console.log('====================================');
			console.log(error);
			console.log('====================================');
		}
	}

	const getCurrentUserFromStorage = async () => {
		const currentUserData = await AsyncStorage.getItem('currentUser');
		if (currentUserData) {
			const currentUser = JSON.parse(currentUserData);
			console.log('Retrieved Current User:', currentUser);
			return currentUser;
		}
		return null;
	};

	useEffect(() => {
		getCurrentUserFromStorage();
	}, [navigate])

	const handleLogin = async () => {
		setErrorMessage('');

		if (!email || !password) {
			setErrorMessage('Please fill in both fields.');
			return;
		}

		const loginPayload = {
			email: email.trim(), // Ensure there are no extra spaces
			password: password.trim(),
		};

		console.log("Login Payload:", loginPayload);

		try {
			const response = await axiosInstance.post('/auth/login', loginPayload);
			console.log("Response", response);
			console.log("Response Data", response.data);
			AsyncStorage.setItem('token', response.data.token);

			if (response.data) {
				await handleGetCurrentUser();
				Toast.show({
					type: 'success',
					text1: 'Login Successful',
					text2: 'Welcome back!',
				});
				navigate.navigate('HomeScreen')
				console.log('Token:', response.data.token);
			} else {
				console.log('Error in here');

				setErrorMessage(response.data.message || 'Invalid email or password');
			}
			setEmail('');
			setPassword('');
		} catch (error) {
			console.error('Login error', error);
			setErrorMessage('An error occurred. Please try again.');
		}
	};

	const handleRegister = async () => {
		setErrorMessage('');

		// Basic form validation
		if (!name || !password || !email || !phoneNumber) {
			setErrorMessage('Please fill in all fields.');
			return;
		}

		const registerPayload = {
			name: name.trim(),
			password: password.trim(),
			email: email.trim(),
			description: description.trim(),
			phone_number: phoneNumber.trim(),
			role: role.trim(),
		};

		try {
			const response = await axiosInstance.post('/users/register', registerPayload);
			console.log("Register Response:", response);

			if (response.data) {
				Toast.show({
					type: 'success',
					text1: 'Registration Successful',
					text2: 'Welcome to Kitlab!'
				});
				navigate.navigate('HomeScreen');
			} else {
				setErrorMessage(response.data.message || 'Registration failed. Please try again.');
			}
		} catch (error) {
			console.error('Register error', error);
			setErrorMessage(error.response.data.message);
		}
	};

	return (
		<View style={styles.container}>
			{isRegister ? (
				<View>
					<Text style={styles.loginText}>Register</Text>

					<View style={styles.form}>
						<TextInput
							style={styles.input}
							placeholder="Name"
							value={name}
							onChangeText={setName}
						/>
						<TextInput
							style={styles.input}
							placeholder="Email"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
						<TextInput
							style={styles.input}
							placeholder="Phone Number"
							value={phoneNumber}
							onChangeText={setPhoneNumber}
							keyboardType="phone-pad"
						/>
						<TextInput
							style={styles.input}
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							autoCapitalize="none"
						/>
						<TextInput
							style={styles.input}
							multiline={true}
							numberOfLines={3}
							placeholder="Description"
							value={description}
							onChangeText={setDescription}
						/>

						{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

						<TouchableOpacity style={styles.buttonLogin} onPress={handleRegister}>
							<Text style={styles.buttonText}>Register</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => setIsRegister(false)}>
							<Text style={styles.registerLink}>Already have an account? Login</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<View>
					<Text style={styles.loginText}>Login</Text>

					<View style={styles.form}>
						<TextInput
							style={styles.input}
							placeholder="Email"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
						<TextInput
							style={styles.input}
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							autoCapitalize="none"
						/>
						{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

						<TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
							<Text style={styles.buttonText}>Login</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => setIsRegister(true)}>
							<Text style={styles.registerLink}>Don't have an account? Register</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: '100%',
		backgroundColor: '#F5F5F5',
		backgroundColor: '#FFFFFF',
		padding: 20,
		gap: 20
	},
	form: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 10,
	},
	loginText: {
		fontSize: 24,
		fontWeight: '500',
	},
	input: {
		borderColor: '#887E7E',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 15,
		paddingVertical: 12,
		width: 350
	},
	buttonLogin: {
		backgroundColor: '#0B6EFE',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	forgotPassword: {
		display: 'flex',
		alignSelf: 'flex-end',
		fontWeight: 'condensedBold',
		marginRight: 16,
	},
	error: {
		color: 'red',
		fontSize: 14,
		marginTop: 10,
	},
	registerLink: {

	},
	signup: {},
	label: {},
	loginWithGoogle: {}
})
