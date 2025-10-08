import React, { createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const API_URL = "http://10.67.4.179:8000/api";

/* php artisan serve --host=0.0.0.0 --port=8000 */

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

  // Interceptor para tratamento de erros
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('❌ Erro na API:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  const apiFunctions = useMemo(() => ({

    // Cadastro completo
    cadastrarPaciente: async (formData) => {
      const response = await api.post('/pacientes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // Login
    loginPaciente: async (credenciais) => {
      const response = await api.post('/paciente/logar', {
        emailPaciente: credenciais.email,
        senhaPaciente: credenciais.senha
      });
      if (response.data.token) {
        await AsyncStorage.setItem('user_token', response.data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.paciente));
      }
      return response.data;
    },

    // Logout
    logoutPaciente: async () => {
      try {
        // Tenta fazer logout no backend
        await api.post('/paciente/logout');
      } catch (error) {
        console.log('Erro no logout do backend:', error);
      } finally {
        // Sempre limpa os dados locais
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_data');
      }
      return true;
    },

    // Obter perfil do paciente logado
    getPaciente: async () => {
      try {
        const response = await api.get('/paciente/perfil');
        return response.data.paciente;
      } catch (error) {
        console.log('Erro ao obter paciente:', error);
        throw error;
      }
    },

    // Atualizar dados do paciente (exceto foto)
    updatePaciente: async (dados) => {
      try {
        // Primeiro obtém o paciente atual para pegar o ID
        const pacienteAtual = await apiFunctions.getPaciente();
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
        
        // Tratamento de erros de validação
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          Alert.alert('Erro de Validação', errors.join('\n'));
        } else if (error.response?.data?.error) {
          Alert.alert('Erro', error.response.data.error);
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
        }
        
        throw error;
      }
    },

    // Atualizar foto do perfil
    updateFotoPerfil: async (fotoUri) => {
      try {
        // Obtém o paciente atual para pegar o ID
        const pacienteAtual = await apiFunctions.getPaciente();
        const idPaciente = pacienteAtual.idPaciente;

        console.log('📤 Enviando foto para paciente:', idPaciente);

        const formData = new FormData();
        formData.append('fotoPerfil', {
          uri: fotoUri,
          type: 'image/jpeg',
          name: `perfil_${idPaciente}_${Date.now()}.jpg`
        });

        const response = await api.post(`/paciente/${idPaciente}/foto`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          timeout: 60000,
        });

        console.log('✅ Foto atualizada com sucesso:', response.data);
        
        if (response.data.success) {
          // Atualiza os dados locais
          const userData = await AsyncStorage.getItem('user_data');
          if (userData) {
            const updatedUserData = {
              ...JSON.parse(userData),
              fotoPerfil: response.data.paciente.fotoPerfil
            };
            await AsyncStorage.setItem('user_data', JSON.stringify(updatedUserData));
          }
          
          Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
          return response.data.paciente;
        }
        
        return null;
      } catch (error) {
        console.error('❌ Erro ao atualizar foto:', error);
        
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          Alert.alert('Erro de Validação', errors.join('\n'));
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar a foto. Tente novamente.');
        }
        
        throw error;
      }
    },

    // Obter paciente por ID (para uso geral)
    obterPaciente: async (idPaciente) => {
      try {
        const response = await api.get(`/paciente/${idPaciente}`);
        return response.data.paciente;
      } catch (error) {
        console.log('Erro ao obter paciente por ID:', error);
        throw error;
      }
    },

    // Verificar autenticação
    isAuthenticated: async () => {
      const token = await AsyncStorage.getItem('user_token');
      const userData = await AsyncStorage.getItem('user_data');
      return !!(token && userData);
    },

    // Obter dados do usuário do AsyncStorage
    getUserData: async () => {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    },

    // Função auxiliar para obter token
    getToken: async () => {
      return await AsyncStorage.getItem('user_token');
    },

    // Função para atualizar dados locais (após update)
    updateLocalUserData: async (novosDados) => {
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
    }

  }), []);

  return (
    <ApiContext.Provider value={apiFunctions}>
      {children}
    </ApiContext.Provider>
  );
};