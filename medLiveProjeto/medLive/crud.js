import React, { createContext, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const API_URL = "http://192.168.15.3:8000/api";
export const STORAGE_URL = "http://192.168.15.3:8000/storage";

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

  // Interceptor de request
  api.interceptors.request.use(async (config) => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('❌ Erro ao obter token:', error);
    }
    return config;
  });

  // Interceptor de response com tratamento de 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log('❌ Erro na API:', error.response?.data || error.message);
      
      // Se for erro 401, faz logout automático
      if (error.response?.status === 401) {
        try {
          await AsyncStorage.removeItem('user_token');
          await AsyncStorage.removeItem('user_data');
          // Você pode adicionar navegação para a tela de login aqui se necessário
          Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
        } catch (logoutError) {
          console.log('Erro ao fazer logout:', logoutError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Funções da API
  const cadastrarPaciente = async (formData) => {
    const response = await api.post('/paciente/cadastrar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  const loginPaciente = async (credenciais) => {
    const response = await api.post('/paciente/logar', {
      emailPaciente: credenciais.email,
      senhaPaciente: credenciais.senha
    });
    if (response.data.token) {
      await AsyncStorage.setItem('user_token', response.data.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.paciente));
    }
    return response.data;
  };

  const logoutPaciente = async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        await api.post('/paciente/logout');
      }
    } catch (error) {
      console.log('Erro no logout do backend:', error);
    } finally {
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_data');
    }
    return true;
  };

  const getPaciente = async () => {
    try {
      const response = await api.get('/paciente/perfil');
      return response.data.paciente;
    } catch (error) {
      console.log('Erro ao obter paciente:', error);
      
      // Se for 401, já foi tratado no interceptor
      if (error.response?.status !== 401) {
        Alert.alert('Erro', 'Não foi possível carregar o perfil.');
      }
      
      throw error;
    }
  };

  const updatePaciente = async (dados) => {
    try {
      // Primeiro obtém o paciente atual para pegar o ID
      const pacienteAtual = await getPaciente();
      const idPaciente = pacienteAtual.idPaciente;

      // Mapeia os campos para o formato do backend
      const dadosFormatados = {
        nomePaciente: dados.nome,
        emailPaciente: dados.email,
        telefonePaciente: dados.telefone,
        dataNascimento: dados.dataNascimento,
        logradouro: dados.endereco,
        cidade: dados.cidade,
        estado: dados.estado
      };

      console.log('📤 Atualizando paciente:', { idPaciente, dadosFormatados });

      const response = await api.put(`/paciente/${idPaciente}`, dadosFormatados);

      if (response.data.success) {
        // Atualiza os dados locais
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          const updatedUserData = {
            ...JSON.parse(userData),
            ...dadosFormatados
          };
          await AsyncStorage.setItem('user_data', JSON.stringify(updatedUserData));
        }

        return true;
      }
      return false;
    } catch (error) {
      console.log('❌ Erro ao atualizar paciente:', error);

      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        Alert.alert('Erro de Validação', errors.join('\n'));
      } else if (error.response?.data?.error) {
        Alert.alert('Erro', error.response.data.error);
      } else if (error.response?.status !== 401) {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
      }

      throw error;
    }
  };

  const updateFotoPerfil = async (fotoUri) => {
    try {
      const pacienteAtual = await getPaciente();
      const idPaciente = pacienteAtual.idPaciente;

      const formData = new FormData();
      formData.append('fotoPerfil', {
        uri: fotoUri,
        type: 'image/jpeg',
        name: `perfil_${Date.now()}.jpg`
      });

      const response = await api.post(`/paciente/${idPaciente}/foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar foto:', error);
      throw error;
    }
  };

  const deletarFotoPerfil = async () => {
    try {
      const pacienteAtual = await getPaciente();
      const idPaciente = pacienteAtual.idPaciente;

      console.log('🗑️ Deletando foto do paciente:', idPaciente);

      const response = await api.delete(`/paciente/${idPaciente}/foto`);

      if (response.data.success) {
        // Atualiza os dados locais removendo a foto
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          const updatedUserData = {
            ...JSON.parse(userData),
            fotoPerfil: null
          };
          await AsyncStorage.setItem('user_data', JSON.stringify(updatedUserData));
        }

        Alert.alert('Sucesso', 'Foto removida com sucesso!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Erro ao deletar foto:', error);
      if (error.response?.status !== 401) {
        Alert.alert('Erro', 'Não foi possível remover a foto. Tente novamente.');
      }
      throw error;
    }
  };

  const obterPaciente = async (idPaciente) => {
    try {
      const response = await api.get(`/paciente/${idPaciente}`);
      return response.data.paciente;
    } catch (error) {
      console.log('Erro ao obter paciente por ID:', error);
      throw error;
    }
  };

  const isAuthenticated = async () => {
    const token = await AsyncStorage.getItem('user_token');
    const userData = await AsyncStorage.getItem('user_data');
    return !!(token && userData);
  };

  const getUserData = async () => {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  };

  const getToken = async () => {
    return await AsyncStorage.getItem('user_token');
  };

  const updateLocalUserData = async (novosDados) => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const updatedData = { ...JSON.parse(userData), ...novosDados };
        await AsyncStorage.setItem('user_data', JSON.stringify(updatedData));
        return updatedData;
      }
    } catch (error) {
      console.log('Erro ao atualizar dados locais:', error);
    }
  };

const apiFunctions = useMemo(() => ({
    cadastrarPaciente,
    loginPaciente,
    logoutPaciente,
    getPaciente,
    updatePaciente,
    updateFotoPerfil, 
    deletarFotoPerfil,
    obterPaciente,
    isAuthenticated,
    getUserData,
    getToken,
    updateLocalUserData
}), []);

  return (
    <ApiContext.Provider value={apiFunctions}>
      {children}
    </ApiContext.Provider>
  );
};