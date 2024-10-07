import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native"; // Import TouchableOpacity
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons
import HomeScreen from "./pages/HomeScreen"; // Updated import
import ModalScreen from "./pages/ModalScreen"; // Updated import
import SettingsScreen from "./pages/SettingsScreen"; // Import SettingsScreen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={({ navigation }) => ({
            headerTitle: "Level K",
            headerTitleStyle: {
              fontFamily: "FredokaOne_400Regular",
              fontSize: 20,
              color: "#365314",
            },
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="cancel" size={32} color="#4D7C0F" />
              </TouchableOpacity>
            ),
            presentation: "modal",
            headerLargeTitle: true,
            headerLargeTitleStyle: {
              fontFamily: "FredokaOne_400Regular",
              fontSize: 40,
              color: "#365314",
            },
            headerTransparent: true,
            headerBlurEffect: "regular",
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerTitle: "Settings",
            headerStyle: {
              backgroundColor: "#ECFCCB",
            },
            headerBackTitleVisible: false,
            headerTintColor: '#4D7C0F',
            headerTitleStyle: {
              fontFamily: "FredokaOne_400Regular",
              fontSize: 24,
              color: "#365314",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


