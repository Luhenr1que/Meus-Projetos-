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
  const { dadosCadastro, limparDados } = useCadastro();
  const { updateFotoPerfil } = useApi(); // CORREÇÃO: use updateFotoPerfil (não atualizarFotoPerfil)

  const [imagem, setImagem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Abrir modal
  const selecionarImagem = () => setModalVisible(true);

  // Câmera
  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos acessar a câmera');
      return;
    }

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
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos acessar a galeria');
      return;
    }

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

      // Se tem imagem, tenta enviar a foto
      if (imagem?.uri) {
        console.log('📤 Enviando foto...', {
          idPaciente: dadosCadastro.idPaciente,
          uri: imagem.uri
        });

        // CORREÇÃO: Use updateFotoPerfil corretamente
        await updateFotoPerfil(imagem.uri);
        
        Alert.alert('Sucesso', 'Cadastro finalizado com foto!');
      } else {
        Alert.alert('Sucesso', 'Cadastro finalizado sem foto!');
      }

      // Limpa os dados do contexto de cadastro
      limparDados();
      
      // Navega para login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {
      console.error('❌ Erro ao salvar foto:', error);
      
      // Se deu erro na foto mas o cadastro já foi feito, permite continuar
      Alert.alert(
        'Aviso', 
        error.response?.data?.error || 'Foto não pôde ser salva, mas o cadastro foi finalizado. Você pode adicionar a foto depois.',
        [{ 
          text: 'OK', 
          onPress: () => {
            limparDados();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } 
        }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Remover foto selecionada
  const removerFoto = () => {
    setImagem(null);
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

          <View style={styles.fotoContainer}>
            {imagem ? (
              <View style={styles.fotoComContainer}>
                <Image source={{ uri: imagem.uri }} style={styles.fotoSelecionada} />
                <TouchableOpacity style={styles.botaoRemoverFoto} onPress={removerFoto}>
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={selecionarImagem}>
                <LinearGradient
                  colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                  style={styles.fotoPlaceholder}
                >
                  <Ionicons name="camera-outline" size={60} color="#fff" />
                  <Text style={styles.fotoPlaceholderText}>Adicionar Foto</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.observacao}>
            {imagem 
              ? 'Foto selecionada! Toque na foto para alterar.' 
              : 'Toque no círculo acima para adicionar uma foto (opcional).'
            }
          </Text>

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
                  {imagem ? 'Finalizar com Foto' : 'Finalizar Cadastro'}
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