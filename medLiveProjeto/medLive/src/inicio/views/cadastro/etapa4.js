import React, { useState } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Modal, ActivityIndicator, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useCadastro } from '../../../contexts/CadastroContext';
import { useApi } from '../../../../crud';

export default function Cadastro4({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { dadosCadastro } = useCadastro();
  const { atualizarFotoPerfil } = useApi();

  const [imagem, setImagem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Abrir modal
  const selecionarImagem = () => setModalVisible(true);

  // Câmera
  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão negada', 'Precisamos acessar a câmera');

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      setImagem(result.assets[0]);
    }
    setModalVisible(false);
  };

  // Galeria
  const abrirGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão negada', 'Precisamos acessar a galeria');

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      setImagem(result.assets[0]);
    }
    setModalVisible(false);
  };

  // Função para processar imagem para web
  const processarImagemWeb = async (uri) => {
    try {
      // Converte base64 para blob se necessário
      if (uri.startsWith('data:')) {
        const response = await fetch(uri);
        return await response.blob();
      } else {
        // Se for uma URL normal
        const response = await fetch(uri);
        return await response.blob();
      }
    } catch (error) {
      console.error('Erro ao processar imagem web:', error);
      throw error;
    }
  };

const finalizarCadastro = async () => {
  if (!dadosCadastro.idPaciente) {
    Alert.alert('Atenção', 'Paciente inválido.');
    return;
  }

  try {
    setLoading(true);

    // Se não tem imagem, finaliza sem foto
    if (!imagem?.uri) {
      Alert.alert('Sucesso', 'Cadastro finalizado sem foto!');
      navigation.navigate('Login');
      return;
    }

    const formData = new FormData();
    const filename = `perfil_${dadosCadastro.idPaciente}_${Date.now()}.jpg`;

    if (Platform.OS === 'web') {
      // Para web - processa a imagem
      const response = await fetch(imagem.uri);
      const blob = await response.blob();
      formData.append('fotoPerfil', blob, filename);
    } else {
      // Para mobile
      formData.append('fotoPerfil', {
        uri: imagem.uri,
        name: filename,
        type: 'image/jpeg',
      });
    }

    // Adiciona o ID do paciente
    formData.append('idPaciente', dadosCadastro.idPaciente.toString());

    console.log('📤 Enviando foto...', {
      idPaciente: dadosCadastro.idPaciente,
      filename: filename
    });

    // Tenta o método principal primeiro
    try {
      const response = await atualizarFotoPerfil(dadosCadastro.idPaciente, formData);
      console.log('✅ Foto salva no banco:', response);
      Alert.alert('Sucesso', 'Cadastro finalizado com foto!');
      navigation.navigate('Login');
    } catch (error) {
      console.log('🔄 Método principal falhou, tentando alternativo...');
      // Se o método principal falhar, tenta o alternativo
      const response = await atualizarFotoPerfilAlternativo(dadosCadastro.idPaciente, imagem);
      console.log('✅ Foto salva (método alternativo):', response);
      Alert.alert('Sucesso', 'Cadastro finalizado com foto!');
      navigation.navigate('Login');
    }

  } catch (error) {
    console.error('❌ Erro ao salvar foto:', error);
    Alert.alert(
      'Aviso', 
      'Foto não pôde ser salva, mas o cadastro foi finalizado. Você pode adicionar a foto depois.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  } finally {
    setLoading(false);
  }
};

  // Método alternativo para upload
  const tentarUploadAlternativo = async () => {
    try {
      console.log('🔄 Tentando método alternativo de upload...');
      
      if (Platform.OS === 'web') {
        // Para web, tenta converter para base64 e enviar como string
        const response = await fetch(imagem.uri);
        const blob = await response.blob();
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        // Envia como JSON em vez de FormData
        const responseAlt = await fetch('/api/pacientes/foto-perfil', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idPaciente: dadosCadastro.idPaciente,
            fotoBase64: base64
          }),
        });

        if (responseAlt.ok) {
          console.log('✅ Foto salva via método alternativo');
          Alert.alert('Sucesso', 'Cadastro finalizado com foto!');
          navigation.navigate('Login');
          return;
        }
      }

      // Se chegou aqui, ambos os métodos falharam
      throw new Error('Todos os métodos de upload falharam');
      
    } catch (altError) {
      console.error('❌ Método alternativo também falhou:', altError);
      Alert.alert(
        'Aviso', 
        'Foto não pôde ser salva, mas o cadastro foi finalizado. Você pode adicionar a foto depois no perfil.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#2D1B69', '#6247AA'] : ['#6247AA', '#856BCC']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.titulo}>Foto de Perfil</Text>
          <Text style={styles.subtitle}>Adicione uma foto para seu perfil (Opcional)</Text>

          <TouchableOpacity style={styles.fotoContainer} onPress={selecionarImagem}>
            {imagem ? (
              <Image source={{ uri: imagem.uri }} style={styles.fotoSelecionada} />
            ) : (
              <LinearGradient
                colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                style={styles.fotoPlaceholder}
              >
                <Ionicons name="camera-outline" size={60} color="#fff" />
                <Text style={styles.fotoPlaceholderText}>Adicionar Foto</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={finalizarCadastro}
            disabled={loading}
            style={[styles.botoes, loading && { opacity: 0.7 }]}
          >
            <LinearGradient colors={['#6247AA', '#856BCC']} style={styles.gradient}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textBtn}>
                  {imagem ? 'Finalizar com Foto' : 'Cadastrar sem Foto'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botoes, { marginTop: 10 }]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <LinearGradient
              colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
              style={styles.gradient}
            >
              <Text style={styles.textBtn}>Voltar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Modal de escolha da foto */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Escolher Foto</Text>
              <TouchableOpacity style={styles.modalOption} onPress={abrirCamera}>
                <Ionicons name="camera" size={24} color="#6247AA" />
                <Text style={styles.modalOptionText}>Tirar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={abrirGaleria}>
                <Ionicons name="images" size={24} color="#6247AA" />
                <Text style={styles.modalOptionText}>Escolher da Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}