import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

const FavoritesScreen = () => {
  // State variables
  const [arttools, setArttools] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const swipeableRefs = useRef({}); // Khởi tạo như một đối tượng thông thường
  const [openSwipeId, setOpenSwipeId] = useState(null);

  const navigation = useNavigation();

  // Fetch data and load favorites on component mount
  useEffect(() => {
    fetchData();
    loadFavorites();
  }, []);

  // Reload favorites when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    if (favorites.length === 0) {
      setSelectionMode(false)
    }
  }, [favorites])

  // Fetch art tools data from API
  const fetchData = async () => {
    try {
      const response = await axios.get('https://67038b11ab8a8f892730864a.mockapi.io/art');
      setArttools(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites: ', error);
    }
  };

  // Delete a single favorite item
  const deleteFavorite = async (id) => {
    Alert.alert(
      'Delete Favorite',
      'Are you sure you want to remove this item from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter((favId) => favId !== id);
              setFavorites(updatedFavorites);
              await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

              // Remove from selectedItems if selected
              if (selectedItems.has(id)) {
                const updatedSelected = new Set(selectedItems);
                updatedSelected.delete(id);
                setSelectedItems(updatedSelected);
              }

              // Close the Swipeable
              if (swipeableRefs.current[id]) {
                swipeableRefs.current[id].close();
              }

              Toast.show({
                text1: 'Removed from favorites',
                position: 'top',
                type: 'success',
                visibilityTime: 2000,
                autoHide: true,
              });
            } catch (error) {
              console.error('Error deleting favorite: ', error);
            }
          },
        },
      ]
    );
  };

  // Delete all selected favorite items
  const deleteSelectedFavorites = async () => {
    if (selectedItems.size === 0) {
      Alert.alert('No Selection', 'Please select at least one item to delete.');
      return;
    }
    Alert.alert(
      'Delete Selected Favorites',
      'Are you sure you want to delete selected favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter((id) => !selectedItems.has(id));
              setFavorites(updatedFavorites);
              setSelectedItems(new Set());
              await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
              Toast.show({
                text1: 'Removed from favorites',
                position: 'top',
                type: 'success',
                visibilityTime: 2000,
                autoHide: true,
              });
              closeAllSwipes();
            } catch (error) {
              console.error('Error deleting selected favorites: ', error);
            }
          },
        },
      ]
    );
  };
  // Prompt user to confirm deletion of all favorites
  const deleteAllFavorites = () => {
    if (favorites.length === 0) {
      Alert.alert('No Favorites', 'There are no favorites to delete.');
      return;
    }

    Alert.alert(
      'Delete All Favorites',
      'Are you sure you want to delete all favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('favorites');
              Toast.show({
                text1: 'Remove all favorite',
                position: 'top',
                type: 'success',
                visibilityTime: 2000,
                autoHide: true,
              });
              setFavorites([]);
              setSelectedItems(new Set());

              // Close all swipeable rows
              closeAllSwipes();
            } catch (error) {
              console.error('Error clearing AsyncStorage: ', error);
            }
          },
        },
      ]
    );
  };

  // Filter favorites to display
  const favoriteArttools = arttools.filter((arttool) => favorites.includes(arttool.id));

  // Render delete button for swipeable
  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteFavorite(id)}
      >
        <Icon name="trash" size={24} color="#fff" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  // Close all swipeable rows
  const closeAllSwipes = () => {
    Object.values(swipeableRefs.current).forEach((ref) => {
      if (ref && ref.close) {
        ref.close();
      }
    });
  };

  // Toggle selection of an item
  const toggleSelection = (id) => {
    const updatedSelection = new Set(selectedItems);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }

    setSelectedItems(updatedSelection);
  };

  const longPressToSelect = () => {
    setSelectionMode(true); // Activate selection mode
  };

  const selectAll = () => {
    if (selectedItems.size === favorites.length) {
      // Deselect all if everything is selected
      setSelectedItems(new Set());
    } else {
      // Select all items
      const allItems = new Set(favorites);
      setSelectedItems(allItems);
    }
  };

  const cancelSelection = () => {
    setSelectedItems(new Set());
  };

  const cancelCheckbox = () => {
    setSelectionMode(false);
  };



  const newPriceAfterDiscount = (price, limitedTimeDeal) => {
    return price * (1 - limitedTimeDeal);
  }

  // Render each favorite item
  const renderItem = ({ item }) => (
    <Swipeable
      ref={(ref) => {
        if (ref) {
          swipeableRefs.current[item.id] = ref;
        }
      }}
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
      onSwipeableWillOpen={() => {
        // Close the previously open swipeable
        if (openSwipeId && openSwipeId !== item.id && swipeableRefs.current[openSwipeId]) {
          swipeableRefs.current[openSwipeId].close();
        }
        // Set the current item as the open swipeable
        setOpenSwipeId(item.id);
      }}
      onSwipeableClose={() => {
        // Reset openSwipeId when the swipeable is closed
        if (openSwipeId === item.id) {
          setOpenSwipeId(null);
        }
      }}
    >
      <TouchableOpacity
        onLongPress={longPressToSelect} // Activate selection on long press
        onPress={() => {
          if (selectionMode) {
            toggleSelection(item.id);
          } else {
            navigation.navigate('Detailarttool', { arttoolId: item.id, fromFavorites: true });
          }
        }}
        style={styles.card}
      >
        {selectionMode && (
          <TouchableOpacity onPress={() => toggleSelection(item.id)} style={styles.checkboxContainer}>
            <Icon
              name={selectedItems.has(item.id) ? 'check-square' : 'square-o'}
              size={24}
              color={selectedItems.has(item.id) ? '#FF6347' : '#777'}
            />
          </TouchableOpacity>
        )}
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.artName}</Text>
          <Text style={styles.brand}>{item.brandName}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );


  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerButtonsContainer}>
          {selectionMode && (
            <>
              <TouchableOpacity style={styles.headerButton} onPress={selectAll}>
                <Text style={styles.headerButtonText}>
                  {selectedItems.size === favorites.length ? 'Cancel' : 'Select All'}
                </Text>
              </TouchableOpacity>
              {/* Conditionally render the Delete Selected button */}
              {selectedItems.size > 0 && (
                <TouchableOpacity onPress={cancelSelection} style={styles.exitButton}>
                  <Text style={styles.headerButtonText}>Exit Selection</Text>
                </TouchableOpacity>
              )}

              {selectedItems.size > 0 && (
                <TouchableOpacity style={styles.headerButton} onPress={deleteSelectedFavorites}>
                  <Text style={styles.headerButtonText}>Delete Selected</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={cancelCheckbox} style={styles.exitButton}>
                <Text style={styles.headerButtonText}>Exit Checkbox</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Favorites List */}
      {favoriteArttools.length > 0 ? (
        <FlatList
          data={favoriteArttools}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        // Empty State
        <View style={styles.noFavoritesContainer}>
          <Icon name="frown-o" size={50} color="#888" />
          <Text style={styles.noFavoritesText}>No favorites added yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10
  },
  headerButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  deleteAllHeaderButton: {
    backgroundColor: '#B22222',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  brand: {
    fontSize: 16,
    color: '#777',
    marginVertical: 2,
  },
  price: {
    fontSize: 18,
    color: '#FF6347',
    fontWeight: 'bold',
    marginTop: 3
  },
  dealBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  dealText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'column',
    paddingTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  deleteAllButton: {
    backgroundColor: 'red',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteAllButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#888',
  },
  oldPrice: {
    fontSize: 16,
    color: 'grey',
    textDecorationLine: 'line-through',
    marginLeft: 5,
    fontWeight: '300',
    marginTop: 5,
  },
  exitButton: {
    marginLeft: 'auto',
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
