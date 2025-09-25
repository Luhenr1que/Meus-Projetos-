import React, { createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = "http://192.168.15.2:8000/api";

/* php artisan serve --host=0.0.0.0 --port=8000 */

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi deve ser usado dentro de ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  
  // Configurar axios
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: 30000, // 30 segundos
  });

  // Interceptor para adicionar token automático
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.log('Erro ao buscar token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const apiFunctions = useMemo(() => ({

    // CADASTRO COMPLETO - POST /api/cadastrar
    cadastrarPaciente: async (dadosCompletos) => {
      try {
        console.log('Enviando dados para cadastro:', dadosCompletos);
        
        const response = await api.post('/cadastrar', dadosCompletos);
        
        console.log('Resposta do cadastro:', response.data);
        return response.data;
        
      } catch (error) {
        console.log('Erro no cadastro:', error.response?.data);
        throw new Error(
          error.response?.data?.message || 
          error.response?.data?.error || 
          'Erro ao cadastrar paciente'
        );
      }
    },

    // LOGIN - POST /api/login
    loginPaciente: async (credenciais) => {
      try {
        const response = await api.post('/login', {
          emailPaciente: credenciais.email,
          senhaPaciente: credenciais.senha
        });
        
        // Salvar token e dados do usuário
        if (response.data.token) {
          await AsyncStorage.setItem('user_token', response.data.token);
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data.paciente));
        }
        
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.error || 
          'Erro ao fazer login'
        );
      }
    },

    // LOGOUT - POST /api/logout
    logoutPaciente: async () => {
      try {
        const response = await api.post('/logout');
        
        // Limpar storage
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_data');
        
        return response.data;
      } catch (error) {
        // Limpar storage mesmo com erro
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_data');
        throw new Error('Erro ao fazer logout');
      }
    },

    // PERFIL - GET /api/perfil
    getPerfil: async () => {
      try {
        const response = await api.get('/perfil');
        return response.data;
      } catch (error) {
        throw new Error('Erro ao buscar perfil');
      }
    },

    // Verificar se usuário está logado
    isAuthenticated: async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        const userData = await AsyncStorage.getItem('user_data');
        return !!(token && userData);
      } catch (error) {
        return false;
      }
    },

    // Obter dados do usuário logado
    getUserData: async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        return null;
      }
    },

    // Converter imagem para base64
    imageToBase64: async (imageUri) => {
      try {
        // Em React Native, você usaria uma biblioteca como react-native-fs
        // ou react-native-image-base64 para converter a imagem
        // Esta é uma implementação simplificada
        return `data:image/jpeg;base64,${imageUri}`;
      } catch (error) {
        throw new Error('Erro ao processar imagem');
      }
    }

  }), []);

  return (
    <ApiContext.Provider value={apiFunctions}>
      {children}
    </ApiContext.Provider>
  );
};