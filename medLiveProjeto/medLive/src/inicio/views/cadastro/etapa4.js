import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Pressable, Image, Dimensions, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// ✅ IMPORTAR CORRETAMENTE O CONTEXTO E API
import { useCadastro } from '../../../contexts/CadastroContext';
import { useApi } from '../../../../crud';

export default function Cadastro4({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { width, height } = Dimensions.get('window');

  // ✅ USAR CONTEXTO E API
  const { dadosCadastro, atualizarDados, limparDados } = useCadastro();
  const { cadastrarPaciente, imageToBase64 } = useApi();

  const [imagem, setImagem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ DEBUG: Verificar dados do contexto
  useEffect(() => {
    console.log('🔍 Dados do contexto (Cadastro4):', dadosCadastro);
    
    if (dadosCadastro && Object.keys(dadosCadastro).length > 0) {
      console.log('👤 Nome:', dadosCadastro.nomePaciente || 'NÃO ENCONTRADO');
      console.log('📧 Email:', dadosCadastro.emailPaciente || 'NÃO ENCONTRADO');
    } else {
      console.log('❌ Nenhum dado encontrado no contexto');
      Alert.alert(
        '⚠️ Dados não encontrados', 
        'Volte para a tela anterior e preencha os dados obrigatórios.',
        [
          {
            text: 'Voltar',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  }, []);

  // ✅ FUNÇÃO PARA CONVERTER IMAGEM PARA BASE64 (SIMPLIFICADA)
  const converterImagemParaBase64 = async (imageUri) => {
    try {
      console.log('📸 Convertendo imagem:', imageUri);
      
      // Implementação simplificada para React Native
      // Em produção, considere usar react-native-fs ou similar
      return 'data:image/jpeg;base64,'; // Placeholder - ajuste conforme sua necessidade
    } catch (error) {
      console.log('❌ Erro ao converter imagem:', error);
      return null;
    }
  };

  // ✅ FUNÇÃO PRINCIPAL PARA CADASTRAR (CORRIGIDA)
  const finalizarCadastro = async (comFoto = false) => {
    // Verificar se existem dados mínimos
    if (!dadosCadastro || Object.keys(dadosCadastro).length === 0) {
      Alert.alert(
        '❌ Dados não encontrados', 
        'Volte para as telas anteriores e preencha os dados obrigatórios.',
        [{ text: 'Voltar', onPress: () => navigation.goBack() }]
      );
      return;
    }

    // Validar campos obrigatórios
    const camposObrigatorios = [
      'nomePaciente', 'emailPaciente', 'telefonePaciente', 
      'senhaPaciente', 'dataNascimento'
    ];

    const camposFaltantes = camposObrigatorios.filter(campo => 
      !dadosCadastro[campo] || dadosCadastro[campo] === ''
    );

    if (camposFaltantes.length > 0) {
      Alert.alert(
        '❌ Campos obrigatórios faltando', 
        `Preencha os seguintes campos:\n\n• ${camposFaltantes.join('\n• ')}`,
        [{ text: 'Voltar', onPress: () => navigation.goBack() }]
      );
      return;
    }

    try {
      setLoading(true);

      // Preparar dados para a API
      const dadosParaAPI = {
        // Dados pessoais (ETAPA 1)
        nomePaciente: dadosCadastro.nomePaciente,
        emailPaciente: dadosCadastro.emailPaciente,
        dataNascimento: dadosCadastro.dataNascimento,
        telefonePaciente: dadosCadastro.telefonePaciente,
        senhaPaciente: dadosCadastro.senhaPaciente,
        
        // Endereço (ETAPA 2)
        cep: dadosCadastro.cep || '',
        logradouro: dadosCadastro.logradouro || '',
        numero: dadosCadastro.numero || '',
        complemento: dadosCadastro.complemento || '',
        bairro: dadosCadastro.bairro || '',
        cidade: dadosCadastro.cidade || '',
        estado: dadosCadastro.estado || '',
        
        // Saúde (ETAPA 3)
        peso: dadosCadastro.peso || '',
        altura: dadosCadastro.altura || '',
        tipoSanguineo: dadosCadastro.tipoSanguineo || '',
        
        // Foto (ETAPA 4 - Opcional)
        fotoPerfil: comFoto && imagem ? await converterImagemParaBase64(imagem) : null
      };

      console.log('📤 Dados enviados para API:', dadosParaAPI);

      // ✅ CHAMAR SUA FUNÇÃO DE CADASTRO
      const resultado = await cadastrarPaciente(dadosParaAPI);
      navigation.navigate('Login')
      console.log('✅ Resposta da API:', resultado);
      Alert.alert(
          '✅ Cadastro Concluído!', 
          'Sua conta foi criada com sucesso!',
          [
            {
              text: 'Fazer Login',
              onPress: () => {
                // ✅ NAVEGAR PARA A TELA DE LOGIN CORRETAMENTE
                console.log('🔄 Navegando para Login...');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            }
          ],
          { cancelable: false })

      if (resultado.success || resultado.paciente) {
        // Limpar dados do contexto após cadastro bem-sucedido
        limparDados();
        
        // ✅ REDIRECIONAMENTO CORRIGIDO - usar setTimeout para garantir que o Alert seja mostrado
         // Impede que o usuário feche sem escolher
        
        
      } else {
        throw new Error(resultado.message || 'Erro no cadastro');
      }

    } catch (error) {
      console.log('❌ Erro no cadastro:', error);
      Alert.alert(
        '❌ Erro no Cadastro', 
        error.message || 'Não foi possível completar o cadastro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO PARA CADASTRAR COM FOTO
  const cadastrarComFoto = async () => {
    if (!imagem) {
      Alert.alert('⚠️', 'Selecione uma foto primeiro');
      return;
    }
    await finalizarCadastro(true);
  };

  // ✅ FUNÇÃO PARA CADASTRAR SEM FOTO
  const cadastrarSemFoto = async () => {
    await finalizarCadastro(false);
  };

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

  const temDadosSuficientes = dadosCadastro && 
    dadosCadastro.nomePaciente && 
    dadosCadastro.emailPaciente && 
    dadosCadastro.telefonePaciente && 
    dadosCadastro.senhaPaciente;

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
            <Text style={styles.subtitle}>Adicione uma foto para seu perfil (Opcional)</Text>
          </View>

          {/* Área da Foto */}
          <View style={styles.formContainer}>
            <View style={styles.fotoContainer}>
              <TouchableOpacity 
                onPress={selecionarImagem} 
                style={styles.fotoButton}
                disabled={!temDadosSuficientes}
              >
                {imagem ? (
                  <Image 
                    source={{ uri: imagem }} 
                    style={styles.fotoSelecionada} 
                  />
                ) : (
                  <LinearGradient
                    colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                    style={[
                      styles.fotoPlaceholder,
                      !temDadosSuficientes && { opacity: 0.5 }
                    ]}
                  >
                    <Ionicons name="camera-outline" size={40} color="#fff" />
                    <Text style={styles.fotoPlaceholderText}>Adicionar Foto</Text>
                  </LinearGradient>
                )}
                
                {imagem && (
                  <View style={styles.editIconContainer}>
                    <Ionicons name="pencil" size={20} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.instrucoesText}>
                {imagem 
                  ? 'Toque para alterar a foto' 
                  : 'A foto é opcional. Você pode pular esta etapa.'
                }
              </Text>
            </View>

            {/* RESUMO DOS DADOS */}
            {temDadosSuficientes && (
              <View style={styles.dadosResumo}>
                <Text style={styles.dadosTitulo}>Resumo do Cadastro</Text>
                <Text style={styles.dadosItem}>👤 {dadosCadastro.nomePaciente}</Text>
                <Text style={styles.dadosItem}>📧 {dadosCadastro.emailPaciente}</Text>
                <Text style={styles.dadosItem}>📞 {dadosCadastro.telefonePaciente}</Text>
              </View>
            )}

            {/* Botão de Finalizar Cadastro COM FOTO */}
            <TouchableOpacity 
              style={[
                styles.botoes, 
                (!temDadosSuficientes || loading) && styles.buttonDisabled
              ]} 
              onPress={cadastrarComFoto}
              disabled={loading || !temDadosSuficientes}
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
                    <Text style={styles.textBtn}>
                      {!temDadosSuficientes 
                        ? 'Dados Incompletos' 
                        : imagem ? 'Finalizar com Foto' : 'Selecione uma Foto'
                      }
                    </Text>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Botão Cadastrar SEM FOTO */}
            <TouchableOpacity 
              style={[
                styles.botoes, 
                { marginTop: 10 },
                (!temDadosSuficientes || loading) && styles.buttonDisabled
              ]} 
              onPress={cadastrarSemFoto}
              disabled={loading || !temDadosSuficientes}
            >
              <LinearGradient
                colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, loading && { opacity: 0.7 }]}
              >
                <Ionicons name="arrow-forward" size={20} color="#fff" />
                <Text style={styles.textBtn}>
                  {!temDadosSuficientes 
                    ? 'Dados Incompletos' 
                    : 'Cadastrar sem Foto'
                  }
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Botão Voltar */}
            <TouchableOpacity 
              style={[styles.botoes, { marginTop: 10 }]} 
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <LinearGradient
                colors={isDarkMode ? ['#444', '#555'] : ['#999', '#aaa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, loading && { opacity: 0.7 }]}
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