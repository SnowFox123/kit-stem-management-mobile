import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Tag = ({ name }) => {
	return (
		<View style={styles.tag}>
			<Text style={styles.tagText}>{name}</Text>
		</View>
	);
};

export default Tag;

const styles = StyleSheet.create({
	tag: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: '#3a4eb8',
		borderRadius: 3,
		marginRight: 10,
		marginBottom: 10,
		height: 30,
		marginHorizontal: 10
	},
	tagText: {
		fontSize: 14,
		color: '#ffffff',
	},
});
