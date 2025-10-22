import React, { createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = "http://192.168.15.5:8000/api";

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi deve ser usado dentro de ApiProvider');
  return context;
};

export const ApiProvider = ({ children }) => {
  const api = axios.create({
    baseURL: API_URL,
    headers: { 'Accept': 'application/json' },
    timeout: 30000,
  });

  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('user_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const apiFunctions = useMemo(() => ({

    // Cadastro completo
    cadastrarPaciente: async (formData) => {
      const response = await api.post('/pacientes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // Atualizar foto - CORRIGIDA
    atualizarFotoPerfil: async (idPaciente, formData) => {
      try {
        console.log('📤 Enviando foto para paciente:', idPaciente);
        
        // Para debug - verificar o que está no formData
        if (__DEV__) {
          console.log('FormData recebido:', {
            idPaciente,
            hasFotoPerfil: formData.has('fotoPerfil'),
            hasIdPaciente: formData.has('idPaciente')
          });
        }

        const response = await api.post(`/pacientes/${idPaciente}/foto-perfil`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          // Timeout maior para upload de imagens
          timeout: 60000,
        });

        console.log('✅ Foto atualizada com sucesso:', response.data);
        return response.data;

      } catch (error) {
        console.error('❌ Erro ao atualizar foto:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        throw error;
      }
    },

    // Método alternativo para upload de foto (se o primeiro falhar)
    atualizarFotoPerfilAlternativo: async (idPaciente, imagem) => {
      try {
        console.log('🔄 Usando método alternativo para upload...');
        
        const formData = new FormData();
        
        // Prepara a imagem para upload
        let uri = imagem.uri;
        let filename = imagem.fileName || `perfil_${idPaciente}_${Date.now()}.jpg`;
        let type = 'image/jpeg';

        // Detecta o tipo da imagem
        if (imagem.uri) {
          const ext = imagem.uri.split('.').pop()?.toLowerCase();
          if (ext === 'png') type = 'image/png';
          else if (ext === 'gif') type = 'image/gif';
        }

        // Para web vs mobile
        if (Platform.OS === 'web') {
          // Web - usa fetch para converter para blob
          const response = await fetch(imagem.uri);
          const blob = await response.blob();
          formData.append('fotoPerfil', blob, filename);
        } else {
          // Mobile - usa o objeto padrão
          formData.append('fotoPerfil', {
            uri: imagem.uri,
            name: filename,
            type: type,
          });
        }

        // Adiciona ID do paciente como campo adicional
        formData.append('idPaciente', idPaciente.toString());

        const response = await api.post(`/pacientes/${idPaciente}/foto`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          timeout: 60000,
        });

        console.log('✅ Foto atualizada (método alternativo):', response.data);
        return response.data;

      } catch (error) {
        console.error('❌ Erro no método alternativo:', error);
        throw error;
      }
    },

    loginPaciente: async (credenciais) => {
      const response = await api.post('/login', {
        emailPaciente: credenciais.email,
        senhaPaciente: credenciais.senha
      });
      if (response.data.token) {
        await AsyncStorage.setItem('user_token', response.data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.paciente));
      }
      return response.data;
    },

    logoutPaciente: async () => {
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_data');
      return true;
    },

    getPerfil: async () => {
      const response = await api.get('/perfil');
      return response.data;
    },

    isAuthenticated: async () => {
      const token = await AsyncStorage.getItem('user_token');
      const userData = await AsyncStorage.getItem('user_data');
      return !!(token && userData);
    },

    getUserData: async () => {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }

  }), []);

  return (
    <ApiContext.Provider value={apiFunctions}>
      {children}
    </ApiContext.Provider>
  );
};