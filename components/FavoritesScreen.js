import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
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
  const [loading, setLoading] = useState(false);
  const swipeableRefs = useRef({});
  const [openSwipeId, setOpenSwipeId] = useState(null);
  const navigation = useNavigation();

  // New state variables for the confirmation modal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'all' or 'selected'

  useEffect(() => {
    loadFavorites();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const storedFavorites = await AsyncStorage.getItem('favoriteskits');
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites);
        setFavoritesKits(favoritesArray);
        await fetchKits(favoritesArray);
      }
    } catch (error) {
      console.error('Error loading favoriteskits: ', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKits = async (favoritesArray) => {
    try {
      const responses = await Promise.all(
        favoritesArray.map(async (_id) => {
          const response = await getKitByID(_id);
          return response && Array.isArray(response) ? response[0] : null;
        })
      );

      const validKits = responses.filter(kit => kit && kit._id);
      setKits(validKits);
    } catch (error) {
      console.error('Error fetching kits: ', error);
    }
  };

  const longPressToSelect = () => {
    setSelectionMode(true);
  };

  const toggleSelection = (_id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(_id)) {
      newSelectedItems.delete(_id);
      if (newSelectedItems.size === 0) {
        setSelectionMode(false);
      }
    } else {
      newSelectedItems.add(_id);
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

  const deleteSelectedFavorites = () => {
    setDeleteType('selected');
    setConfirmModalVisible(true);
  };

  const deleteAllFavorites = () => {
    setDeleteType('all');
    setConfirmModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteType === 'selected') {
      const updatedFavorites = favoritesKits.filter(_id => !selectedItems.has(_id));
      try {
        await AsyncStorage.setItem('favoriteskits', JSON.stringify(updatedFavorites));
        setFavoritesKits(updatedFavorites);
        setKits(kits.filter(kit => updatedFavorites.includes(kit._id)));
        setSelectedItems(new Set());
        setSelectionMode(false);
      } catch (error) {
        console.error('Error deleting selected favorites: ', error);
      }
    } else if (deleteType === 'all') {
      try {
        await AsyncStorage.removeItem('favoriteskits');
        setFavoritesKits([]);
        setKits([]);
      } catch (error) {
        console.error('Error deleting all favorites: ', error);
      }
    }
    setConfirmModalVisible(false); // Close the modal after deletion
  };

  const cancelDelete = () => {
    setConfirmModalVisible(false); // Close the modal without action
  };

  const renderRightActions = (_id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFavorite(_id)}>
      <Icon name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  const deleteFavorite = async (_id) => {
    const updatedFavorites = favoritesKits.filter(favId => favId !== _id);
    await AsyncStorage.setItem('favoriteskits', JSON.stringify(updatedFavorites));
    setFavoritesKits(updatedFavorites);
    setKits(kits.filter(kit => kit._id !== _id));
  };

  const renderItem = ({ item }) => (
    <Swipeable
      ref={(ref) => {
        if (ref) {
          swipeableRefs.current[item._id] = ref;
        }
      }}
      renderRightActions={() => renderRightActions(item._id)}
      overshootRight={false}
      onSwipeableWillOpen={() => {
        if (openSwipeId && openSwipeId !== item._id && swipeableRefs.current[openSwipeId]) {
          swipeableRefs.current[openSwipeId].close();
        }
        setOpenSwipeId(item._id);
      }}
      onSwipeableClose={() => {
        if (openSwipeId === item._id) {
          setOpenSwipeId(null);
        }
      }}
    >
      <TouchableOpacity
        onLongPress={() => {
          toggleSelection(item._id);
          if (!selectedItems.has(item._id)) {
            setSelectionMode(true);
          }
        }}
        onPress={() => {
          if (selectionMode) {
            toggleSelection(item._id);
          } else {
            navigation.navigate('Detailkits', { kitId: item._id, fromFavorites: true });
          }
        }}
        style={styles.card}
      >
        {selectionMode && (
          <TouchableOpacity onPress={() => toggleSelection(item._id)} style={styles.checkboxContainer}>
            <Icon
              name={selectedItems.has(item._id) ? 'check-square' : 'square-o'}
              size={24}
              color={selectedItems.has(item._id) ? '#FF6347' : '#777'}
            />
          </TouchableOpacity>
        )}
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{item.category_name}</Text>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.status}>{item.status}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
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
  {!selectionMode && favoritesKits.length > 0 && (
    <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllFavorites}>
      <Text style={styles.headerButtonText}>Delete All</Text>
    </TouchableOpacity>
  )}
</View>

      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : kits.length > 0 ? (
        <FlatList
          data={kits}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View style={styles.noFavoritesContainer}>
          <Icon name="frown-o" size={50} color="#888" />
          <Text style={styles.noFavoritesText}>No favorites kits added yet.</Text>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={confirmModalVisible}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {deleteType === 'all' ? 'Confirm Delete All' : 'Confirm Delete Selected'}
            </Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to {deleteType === 'all' ? 'delete all favorites?' : 'delete selected favorites?'}
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={cancelDelete}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteAllButton: {
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
  status: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  exitButton: {
    marginLeft: 'auto',
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
