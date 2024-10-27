import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import HomeScreen from './components/HomeScreen';
import KitsScreen from './components/KitsScreen';
import LabsScreen from './components/LabsScreen';
import FavoritesScreen from './components/FavoritesScreen';
import Profile from './components/Profile';
import Detailkits from './components/Detailkits';
import Detaillabs from './components/Detaillabs';
import AllComments from './components/AllComments';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home stack navigator
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: "Home" }} />
    <Stack.Screen name="Detailkits" component={Detailkits} options={{ title: "Art Details" }} />
    <Stack.Screen name="AllComments" component={AllComments} options={{ title: "All Comments" }} />
    <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }} />
  </Stack.Navigator>
);

// Kits stack navigator
const KitsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="KitsScreen" component={KitsScreen} options={{ title: "Kits Collection" }} />
    <Stack.Screen name="Detailkits" component={Detailkits} options={{ title: "Kit Details" }} />
    <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }} />
  </Stack.Navigator>
);

// Labs stack navigator
const LabsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="LabsScreen" component={LabsScreen} options={{ title: "Labs Collection" }} />
    <Stack.Screen name="Detaillabs" component={Detaillabs} options={{ title: "Lab Details" }} />
    <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }} />
  </Stack.Navigator>
);

// Favorites stack navigator
const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ title: "Favorite Arttools" }} />
    <Stack.Screen name="Detailkits" component={Detailkits} options={{ title: "Detail kits" }} />
    <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }} />
  </Stack.Navigator>
);

// Main app component with tab navigator
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Favorites") {
              iconName = "heart";
            } else if (route.name === "Profile") {
              iconName = "user";
            } else if (route.name === "Kits") {
              iconName = "wrench";
            } else if (route.name === "Labs") {
              iconName = "mortar-board";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "rgb(0, 110, 173)",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Kits" component={KitsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Labs" component={LabsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Favorites" component={FavoritesStack} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
};
// Styles for header title
const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default App;
