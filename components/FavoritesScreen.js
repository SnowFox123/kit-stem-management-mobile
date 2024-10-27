import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getKitByID } from '../service/UserServices';

const FavoritesScreen = () => {
  const [kits, setKits] = useState([]);
  const [favoritesKits, setFavoritesKits] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const swipeableRefs = useRef({});
  const [openSwipeId, setOpenSwipeId] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Fetch kits based on favorite IDs
  const fetchData = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteskits');
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites);
        setFavoritesKits(favoritesArray);

        const responses = await Promise.all(
          favoritesArray.map(async (id) => {
            const response = await getKitByID(id);
            return response[0]; // Assuming response is an array and we're interested in the first element
          })
        );

        // Filter out null responses
        const validKits = responses.filter(kit => kit !== null);
        setKits(validKits);
      }
    } catch (error) {
      console.error('Error loading favoriteskits: ', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteskits');
      if (storedFavorites) {
        setFavoritesKits(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favoriteskits: ', error);
    }
  };

  const longPressToSelect = () => {
    setSelectionMode(true);
  };

  const toggleSelection = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  const selectAll = () => {
    if (selectedItems.size === favoritesKits.length) {
      setSelectedItems(new Set());
    } else {
      const newSelectedItems = new Set(favoritesKits);
      setSelectedItems(newSelectedItems);
    }
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedItems(new Set());
  };

  const deleteSelectedFavorites = async () => {
    const updatedFavorites = favoritesKits.filter(id => !selectedItems.has(id));
    await AsyncStorage.setItem('favoriteskits', JSON.stringify(updatedFavorites));
    setFavoritesKits(updatedFavorites);
    setKits(kits.filter(kit => updatedFavorites.includes(kit.id)));
    setSelectedItems(new Set());
    setSelectionMode(false);
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFavorite(id)}>
      <Icon name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  const deleteFavorite = async (id) => {
    const updatedFavorites = favoritesKits.filter(favId => favId !== id);
    await AsyncStorage.setItem('favoriteskits', JSON.stringify(updatedFavorites));
    setFavoritesKits(updatedFavorites);
    setKits(kits.filter(kit => kit.id !== id));
  };

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
        if (openSwipeId && openSwipeId !== item.id && swipeableRefs.current[openSwipeId]) {
          swipeableRefs.current[openSwipeId].close();
        }
        setOpenSwipeId(item.id);
      }}
      onSwipeableClose={() => {
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
            // navigation.navigate('Detailarttool', { arttoolId: item.id, fromFavorites: true });
            navigation.navigate('Detailkits', { kitId: item._id, fromFavorites: true });
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
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{item.category_name}</Text>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.title}>{item.status}</Text>
          {/* <Text style={styles.title}>{item.description}</Text> */}
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
                  {selectedItems.size === favoritesKits.length ? 'Cancel' : 'Select All'}
                </Text>
              </TouchableOpacity>
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
            </>
          )}
        </View>
      </View>

      {/* Favorites List */}
      {kits.length > 0 ? (
        <FlatList
          data={kits}
          keyExtractor={(item) => item.id} // Ensure you have the correct key
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        // Empty State
        <View style={styles.noFavoritesContainer}>
          <Icon name="frown-o" size={50} color="#888" />
          <Text style={styles.noFavoritesText}>No favorites kits added yet.</Text>
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
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  headerButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
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
    marginTop: 3,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginVertical: 5,
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
  exitButton: {
    marginLeft: 'auto',
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});

export default FavoritesScreen;
