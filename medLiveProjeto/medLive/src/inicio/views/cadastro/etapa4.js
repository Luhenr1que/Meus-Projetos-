import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Image, Dimensions, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function Cadastro4({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { width, height } = Dimensions.get('window');

  // Receber dados da tela anterior se existirem
  const dadosAnteriores = route.params?.formData || {};
  
  const [imagem, setImagem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Solicitar permissões da câmera e galeria
  const solicitarPermissoes = async (tipo) => {
    if (tipo === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  // Abrir câmera
  const abrirCamera = async () => {
    const temPermissao = await solicitarPermissoes('camera');
    if (!temPermissao) {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar sua câmera.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImagem(result.assets[0].uri);
      }
      setModalVisible(false);
    } catch (error) {
      console.log('Erro ao abrir câmera:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  // Abrir galeria
  const abrirGaleria = async () => {
    const temPermissao = await solicitarPermissoes('galeria');
    if (!temPermissao) {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImagem(result.assets[0].uri);
      }
      setModalVisible(false);
    } catch (error) {
      console.log('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const selecionarImagem = () => {
    setModalVisible(true);
  };

  const handleContinuar = async () => {
    try {
      setLoading(true);
      
      // Aqui você integraria com sua API para salvar a foto
      if (imagem) {
        Alert.alert('✅', 'Foto de perfil salva com sucesso!');
      }
      
      // Navegar para próxima tela com todos os dados
      navigation.navigate('ProximaTela', { 
        formData: {
          ...dadosAnteriores,
          fotoPerfil: imagem
        }
      });
      
    } catch (error) {
      console.log("❌ Erro ao salvar foto:", error);
      Alert.alert("❌", "Erro ao salvar foto de perfil");
    } finally {
      setLoading(false);
    }
  };

  const pularEtapa = () => {
    navigation.navigate('ProximaTela', { 
      formData: {
        ...dadosAnteriores,
        fotoPerfil: null
      }
    });
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#2D1B69', '#6247AA'] : ['#6247AA', '#856BCC']}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header com Logo */}
          <View style={styles.header}>
            <Image 
              source={require('../../../../assets/img/medLiveLogo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.titulo}>Foto de Perfil</Text>
            <Text style={styles.subtitle}>Adicione uma foto para seu perfil</Text>
          </View>

          {/* Área da Foto */}
          <View style={styles.formContainer}>
            <View style={styles.fotoContainer}>
              <TouchableOpacity onPress={selecionarImagem} style={styles.fotoButton}>
                {imagem ? (
                  <Image 
                    source={{ uri: imagem }} 
                    style={styles.fotoSelecionada} 
                  />
                ) : (
                  <LinearGradient
                    colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                    style={styles.fotoPlaceholder}
                  >
                    <Ionicons name="camera-outline" size={40} color="#fff" />
                    <Text style={styles.fotoPlaceholderSubtext}>Toque para adicionar foto</Text>
                  </LinearGradient>
                )}
                
                {/* Ícone de edição quando há imagem */}
                {imagem && (
                  <View style={styles.editIconContainer}>
                    <Ionicons name="pencil" size={20} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.instrucoesText}>
                {imagem ? 'Toque para alterar a foto' : 'Toque para adicionar uma foto de perfil'}
              </Text>
            </View>

            {/* Botão de continuar */}
            <TouchableOpacity 
              style={styles.botoes} 
              onPress={handleContinuar} 
              disabled={loading}
            >
              <LinearGradient
                colors={['#6247AA', '#856bccff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, loading && { opacity: 0.7 }]}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.textBtn}>Finalizar Cadastro</Text>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Botão Pular */}
            <TouchableOpacity 
              style={[styles.botoes, { marginTop: 10 }]} 
              onPress={pularEtapa}
            >
              <LinearGradient
                colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Ionicons name="arrow-forward" size={20} color="#fff" />
                <Text style={styles.textBtn}>Pular Esta Etapa</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Botão Voltar */}
            <TouchableOpacity 
              style={[styles.botoes, { marginTop: 10 }]} 
              onPress={() => navigation.goBack()}
            >
              <LinearGradient
                colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Ionicons name="arrow-back" size={20} color="#fff" />
                <Text style={styles.textBtn}>Voltar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Escolha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolher Foto</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={abrirCamera}
            >
              <Ionicons name="camera" size={24} color="#6247AA" />
              <Text style={styles.modalOptionText}>Tirar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={abrirGaleria}
            >
              <Ionicons name="images" size={24} color="#6247AA" />
              <Text style={styles.modalOptionText}>Escolher da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}