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

      console.log('📤 Enviando foto...', {
        idPaciente: dadosCadastro.idPaciente,
        filename: `perfil_${dadosCadastro.idPaciente}_${Date.now()}.jpg`
      });

      // Usa apenas o método atualizarFotoPerfil do contexto
      await atualizarFotoPerfil(imagem.uri);
      
      Alert.alert('Sucesso', 'Cadastro finalizado com foto!');
      navigation.navigate('Login');

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