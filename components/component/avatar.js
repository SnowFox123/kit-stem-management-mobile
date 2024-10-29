import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getFirstCharacter } from '../../utils/stringHelper'

function Avatar({ name }) {

	return (
		<View style={styles.container}>
			<Text style={styles.avatar}>
				{getFirstCharacter(name)}
			</Text>
		</View>
	)
}

export default Avatar


const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#f89cf2',
		color: '#271325',
		fontSize: 60,
		alignItems: 'center',
		textAlign: 'center',
		lineHeight: 100,
		fontWeight: 'bold',
	}
})
