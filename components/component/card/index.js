import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function BlogCard({ title, description, image_url, category_name, user_name, created_at }) {
	return (
		<TouchableOpacity style={styles.card}>
			{/* Blog Image */}
			<Image source={{ uri: image_url }} style={styles.image} />

			{/* Blog Info */}
			<View style={styles.content}>
				<View style={styles.textContent}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.description}>{description}</Text>
				</View>

				{/* Additional Info */}
				<View style={styles.metaInfo}>
					<Text style={styles.category}>Category: {category_name}</Text>
					<Text style={styles.author}>By: {user_name}</Text>
					<Text style={styles.date}>Posted: {new Date(created_at).toLocaleDateString()}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default BlogCard;

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 1, height: 2 },
		shadowRadius: 10,
		elevation: 2,
		overflow: 'hidden',
		width: 250,
		height: 400,
	},
	image: {
		width: '100%',
		height: 200,
	},
	content: {
		padding: 15,
		flex: 1,
		justifyContent: 'space-between',
	},
	textContent: {
		flexGrow: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	description: {
		fontSize: 16,
		color: '#666',
		marginBottom: 10,
		flexWrap: 'wrap',
	},
	metaInfo: {
		marginTop: 10,
	},
	category: {
		fontSize: 14,
		color: '#888',
	},
	author: {
		fontSize: 14,
		color: '#888',
	},
	date: {
		fontSize: 14,
		color: '#888',
		marginTop: 5,
	},
});
