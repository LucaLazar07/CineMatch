import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { BottomNavBar } from "../components/BottomNavBar";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import MovieDetailScreen from "../screens/MovieDetailScreen";
import SavedScreen from "../screens/SavedScreen";
import WatchedScreen from "../screens/WatchedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import MoodResultsScreen from "../screens/MoodResultsScreen";
import type { RootStackParamList, MainTabParamList } from "./types";
import { tokens } from "../theme/tokens";
import { AuthProvider, useAuth } from "../storage/AuthContext";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: tokens.colors.bg,
    card: tokens.colors.bg,
    text: tokens.colors.ink,
    border: tokens.colors.divider,
    primary: tokens.colors.primaryRed,
  },
};

function MainTabs(): React.ReactElement {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Watched" component={WatchedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppContent(): React.ReactElement {
  const { session, booting, login } = useAuth();

  if (booting) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.colors.bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={tokens.colors.primaryRed} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={NavTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.colors.bg },
        }}
      >
        {session ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="MovieDetail"
              component={MovieDetailScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="MoodResults"
              component={MoodResultsScreen}
              options={{ animation: "slide_from_right" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  onLoggedIn={login}
                  onOpenRegister={() => navigation.navigate("Register")}
                  onOpenForgot={() => navigation.navigate("ForgotPassword")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {({ navigation }) => (
                <RegisterScreen
                  onRegistered={login}
                  onOpenLogin={() => navigation.navigate("Login")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="ForgotPassword">
              {({ navigation }) => (
                <ForgotPasswordScreen
                  onDone={() => navigation.navigate("Login")}
                  onGoBack={() => navigation.navigate("Login")}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator(): React.ReactElement {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
