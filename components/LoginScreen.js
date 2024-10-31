import React, { useEffect, useState } from 'react'
import { Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { axiosInstance } from '../service/customize-axios';
import Toast from 'react-native-toast-message';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function LoginScreen() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigation();

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
			email: email.trim(),
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

	return (
		<View style={styles.container}>

			<View style={styles.container}>
				<Image
					source={{ uri: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/63517e79bdf94bc8daa1bf18/0x0.png' }}
					style={styles.logo}
					resizeMode="contain"
				/>
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
					<TouchableOpacity onPress={() => navigate.navigate('ForgotPassword')}>
						<Text>Forgot password</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.buttonLogin} onPress={() => navigate.navigate("Home", { screen: 'Register' })}>
						<Text style={styles.registerLink}>Create new Account</Text>
					</TouchableOpacity>
				</View>
			</View>

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
		margin: 'auto',
		marginBottom: 20,
		fontSize: 32,
		fontWeight: '700',
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
		width: '100%',
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
		color: '#fff',
		borderColor: '#c70505',
		fontWeight: 'bold'
	},
	logo: {
		width: 200,
		height: 200,
		alignContent: 'center',
		marginHorizontal: 'auto'
	},
})
