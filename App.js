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
import HomeScreen from "./components/HomeScreen";
import KitsScreen from "./components/KitsScreen";
import LabsScreen from "./components/LabsScreen";
import Detaillabs from "./components/Detaillabs";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import Combo from "./components/Combo";
import CartUser from "./components/CartUser";
import DetailCombo from "./components/DetailCombo";
import EditProfile from "./components/EditProfile";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import DeliveryStatus from "./components/DeliveryStatus";
import PurchaseHistory from "./components/PurchaseHistory";
import CheckOut from "./components/CheckOut";

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
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Detailkits"
      component={Detailkits}
      options={{
        title: "Detailkits",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="DetailCombo"
      component={DetailCombo}
      options={{
        title: "Combo Detail",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CheckOut"
      component={CheckOut}
      options={{
        title: "CheckOut",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CartUser"
      component={CartUser}
      options={{
        title: "Cart User",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Detaillabs"
      component={Detaillabs}
      options={{
        title: "Lab Detail",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        title: "Login",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        title: "Create New Account",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{
        title: "Forgot Password",
        headerTitleStyle: styles.headerTitle,
      }}
    />
  </Stack.Navigator>
);

const ComboStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Combo"
      component={Combo}
      options={{
        title: "Combo Collection",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="DetailCombo"
      component={DetailCombo}
      options={{
        title: "Combo Detail",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CartUser"
      component={CartUser}
      options={{
        title: "Cart User",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CheckOut"
      component={CheckOut}
      options={{
        title: "CheckOut",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

// Similarly define KitsStack, LabsStack, and FavoritesStack
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
        title: "Kit Detail",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Detaillabs"
      component={Detaillabs}
      options={{
        title: "Lab Detail",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CheckOut"
      component={CheckOut}
      options={{
        title: "CheckOut",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CartUser"
      component={CartUser}
      options={{
        title: "Cart User",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

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
      name="Detaillabs"
      component={Detaillabs}
      options={{
        title: "Lab Detail",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CartUser"
      component={CartUser}
      options={{
        title: "Cart User",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CheckOut"
      component={CheckOut}
      options={{
        title: "CheckOut",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoritesScreen"
      component={FavoritesScreen}
      options={{
        title: "Favorite kits",
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
      name="CheckOut"
      component={CheckOut}
      options={{
        title: "CheckOut",
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        title: "Profile",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{
        title: "Update Password",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Delivery"
      component={DeliveryStatus}
      options={{
        title: "Delivery",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="PurchaseHistory"
      component={PurchaseHistory}
      options={{
        title: "PurchaseHistory",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        title: "Login",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{
        title: "Forgot Password",
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        title: "Create New Account",
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
            } else if (route.name === "Kits") {
              iconName = "wrench";
            } else if (route.name === "Labs") {
              iconName = "mortar-board";
            } else if (route.name === "Combo") {
              iconName = "rocket";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "rgb(0, 110, 173)",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: ((route) => {
            const routeName = route.name;

            // console.log("🚀 ~ App ~ routeName:", routeName)
            // Hide bottom tab bar on specific screens
            if (["Detailkits", "Detaillabs"].includes(routeName)) {
              return { display: "none" };
            }
            return;
          })(route),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ title: "Home", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Combo"
          component={ComboStack}
          options={{ title: "Combo", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Kits"
          component={KitsStack}
          options={{ title: "Kits", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Labs"
          component={LabsStack}
          options={{ title: "Labs", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesStack}
          options={{ title: "Favorites", headerShown: false, unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{ title: "Profile", headerShown: false, unmountOnBlur: true }}
        />
      </Tab.Navigator>

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
