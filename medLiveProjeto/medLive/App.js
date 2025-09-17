import { Pressable, StyleSheet, Text, View, Alert, useColorScheme, StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from './themeContext';

import Home from './src/principal/views/home/home';
import Login from './src/inicio/views/login/login';
import Cadastro from './src/inicio/views/cadastro/cadastro';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
      <ThemeProvider>
          <NavigationContainer>
             <Stack.Navigator initialRouteName="Cadastro">
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
      </ThemeProvider>
  );
}

