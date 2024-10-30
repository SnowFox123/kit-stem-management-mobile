import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

function RegisterScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigation();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	const handleRegister = async () => {
		setErrorMessage('');

		if (!name || !password || !email || !phoneNumber) {
			setErrorMessage('Please fill in required fields.');
			return;
		}

		const registerPayload = {
			name: name.trim(),
			password: password.trim(),
			email: email.trim(),
			description: description.trim(),
			phone_number: phoneNumber.trim(),
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
		<View style={styles.form}>
			<Image
				source={{ uri: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/63517e79bdf94bc8daa1bf18/0x0.png' }}
				style={styles.logo}
				resizeMode="contain"
			/>

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

	)
}

export default RegisterScreen

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
		height: '100%',
		backgroundColor: '#FFFFFF',
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
		width: '90%',
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
	logo: {
		width: 200,
		height: 200,
		alignContent: 'center',
		marginHorizontal: 'auto'
	},
})