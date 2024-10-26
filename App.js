import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import FavoritesScreen from "./components/FavoritesScreen";
import Detailarttool from "./components/Detailarttool";
import Profile from "./components/Profile";
import AllComments from "./components/AllComments";
import HomeScreen2 from "./components/HomeScreen2";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeStackScreen"
      component={HomeScreen2}
      options={{
        title: "Kit Collection",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Detailarttool"
      component={Detailarttool}
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

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoritesStackScreen"
      component={FavoritesScreen}
      options={{
        title: "Favorite Arttools",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Detailarttool"
      component={Detailarttool}
      options={{
        title: "Details",
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
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#FF6347",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ title: "Home", headerShown: false, unmountOnBlur: true }}
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

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default App;

//npm install @react-navigation/native

//npm install @react-navigation/stack @react-navigation/bottom-tabs
//npm install axios
//npm install @react-native-async-storage/async-storage
//yarn add react-native-reanimated



//npm install react-native-gesture-handler