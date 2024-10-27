import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import FavoritesScreen from "./components/FavoritesScreen";
import Detailkits from "./components/Detailkits";
import Profile from "./components/Profile";
import AllComments from "./components/AllComments";
import HomeScreen from "./components/HomeScreen";
import KitsScreen from "./components/KitsScreen";
import LabsScreen from "./components/LabsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home stack navigator
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: "Home",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Detailkits"
      component={Detailkits}
      options={{
        title: "Art Details",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="AllComments"
      component={AllComments}
      options={{
        title: "All Comments",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        title: "Profile",
        headerTitleStyle: styles.headerTitle,
      }}
    />
  </Stack.Navigator>
);

// Kits stack navigator
const KitsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="KitsScreen"
      component={KitsScreen}
      options={{
        title: "Kits Collection",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Detailkits"
      component={Detailkits}
      options={{
        title: "Kit Details",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        title: "Profile",
        headerTitleStyle: styles.headerTitle,
      }}
    />
  </Stack.Navigator>
);

// Labs stack navigator
const LabsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="LabsScreen"
      component={LabsScreen}
      options={{
        title: "Labs Collection",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Detailkits"
      component={Detailkits}
      options={{
        title: "Lab Details",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        title: "Profile",
        headerTitleStyle: styles.headerTitle,
      }}
    />
  </Stack.Navigator>
);

// Favorites stack navigator
const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoritesScreen"
      component={FavoritesScreen}
      options={{
        title: "Favorite Arttools",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Detailkits"
      component={Detailkits}
      options={{
        title: "Detail kits",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        title: "Profile",
        headerTitleStyle: styles.headerTitle,
      }}
    />
  </Stack.Navigator>
);

// Main app component with tab navigator
const App = () => {
  return (
    <NavigationContainer independent>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "";

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
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ title: "Home", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Kits"
          component={KitsStack} // Use KitsStack here
          options={{ title: "Kits", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Labs"
          component={LabsStack} // Use LabsStack here
          options={{ title: "Labs", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesStack}
          options={{ title: "Favorites", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profile", headerShown: false, unmountOnBlur: true }}
        />
      </Tab.Navigator>

      {/* Place Toast at the root level to be globally available */}
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
