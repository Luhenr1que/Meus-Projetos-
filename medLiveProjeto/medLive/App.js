import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider } from './themeContext';
import { ApiProvider } from './crud';
import { CadastroProvider } from './src/contexts/CadastroContext';
import { AudioProvider } from './audioContext';

import Home from './src/principal/home/home';
import Login from './src/inicio/views/login/login';
import Cadastro from './src/inicio/views/cadastro/cadastro';
import Cadastro2 from './src/inicio/views/cadastro/etapa2';
import Cadastro3 from './src/inicio/views/cadastro/etapa3';
import Cadastro4 from './src/inicio/views/cadastro/etapa4';
import Meditacao from './src/principal/meditação/meditacao';
import Alimentacao from './src/principal/alimentacao/alimentacao';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <CadastroProvider>
          <AudioProvider>
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="Home"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cadastro" component={Cadastro} />
                <Stack.Screen name="Cadastro2" component={Cadastro2} />
                <Stack.Screen name="Cadastro3" component={Cadastro3} />
                <Stack.Screen name="Cadastro4" component={Cadastro4} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Meditacao" component={Meditacao} />
                <Stack.Screen name="Alimentacao" component={Alimentacao} />
              </Stack.Navigator>
            </NavigationContainer>
          </AudioProvider>
        </CadastroProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}