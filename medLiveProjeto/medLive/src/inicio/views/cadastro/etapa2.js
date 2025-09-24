import React, { useState, useRef } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import { Ionicons, MaterialCommunityIcons,FontAwesome5 } from '@expo/vector-icons';

export default function Cadastro2({ navigation, route }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // Receber dados da tela anterior se existirem
  const dadosAnteriores = route.params?.formData || {};
  
  const [formData, setFormData] = useState({
    ...dadosAnteriores,
    cep: "", 
    logradouro: "", 
    numero: "", 
    complemento: "", 
    bairro: "", 
    cidade: "", 
    estado: ""
  });
  
  const [loadingCep, setLoadingCep] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs para os inputs
  const inputRefs = {
    cep: useRef(null),
    logradouro: useRef(null),
    numero: useRef(null),
    complemento: useRef(null),
    bairro: useRef(null),
    cidade: useRef(null)
  };

  const cad = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  // Formatar CEP e buscar automaticamente
  const formatarCep = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 5) {
      formatted = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
    }
    
    cad("cep", formatted);
    
    // Buscar CEP automaticamente quando tiver 9 caracteres
    if (formatted.length === 9) {
      buscarCep(formatted);
    }
  };

  // Buscar dados do CEP na API ViaCEP
  const buscarCep = async (cep) => {
    try {
      setLoadingCep(true);
      const cleanedCep = cep.replace(/\D/g, '');
      
      if (cleanedCep.length !== 8) return;
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        Alert.alert('❌', 'CEP não encontrado');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      }));
      
      // Focar no próximo campo após buscar CEP
      if (inputRefs.numero.current) {
        inputRefs.numero.current.focus();
      }
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert('❌', 'Erro ao buscar CEP');
    } finally {
      setLoadingCep(false);
    }
  };

  // Validar campos obrigatórios
  const validarCampos = () => {
    const { cep, logradouro, numero, bairro, cidade, estado } = formData;

    if (!cep || cep.length !== 9) {
      Alert.alert('⚠️', 'CEP inválido');
      return false;
    }

    if (!logradouro || logradouro.length < 3) {
      Alert.alert('⚠️', 'Logradouro inválido');
      return false;
    }

    if (!numero || numero.length < 1) {
      Alert.alert('⚠️', 'Número inválido');
      return false;
    }

    if (!bairro || bairro.length < 2) {
      Alert.alert('⚠️', 'Bairro inválido');
      return false;
    }

    if (!cidade || cidade.length < 2) {
      Alert.alert('⚠️', 'Cidade inválida');
      return false;
    }

    if (!estado || estado.length !== 2) {
      Alert.alert('⚠️', 'Estado inválido');
      return false;
    }

    return true;
  };

  // Função para continuar o cadastro
  const continuarCadastro = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);
      
      // Aqui você integraria com sua API de cadastro
      Alert.alert('✅', 'Endereço salvo com sucesso!');
      
      // Navegar para próxima tela do cadastro com todos os dados
      navigation.navigate('Cadastro3', { formData });
      
    } catch (error) {
      console.log("❌ Erro ao salvar dados:", error);
      Alert.alert("❌", "Erro ao salvar endereço");
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.titulo}>Endereço</Text>
            <Text style={styles.subtitle}>Informe seu endereço completo</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo CEP */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CEP</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'cep' && styles.inputFocused,
                formData.cep.length === 9 && styles.inputValid
              ]}>
                <Ionicons 
                  name="location-outline" 
                  size={20} 
                  color={focusedInput === 'cep' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRefs.cep}
                  style={styles.textInput}
                  placeholder="00000-000"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="numeric"
                  onChangeText={formatarCep}
                  value={formData.cep}
                  onFocus={() => handleInputFocus('cep')}
                  onBlur={handleInputBlur}
                  maxLength={9}
                />
              </View>
              {loadingCep && (
                <Text style={styles.loadingText}>Buscando CEP...</Text>
              )}
            </View>

            {/* Campo Logradouro */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Logradouro</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'logradouro' && styles.inputFocused,
                formData.logradouro && styles.inputValid
              ]}>
                <FontAwesome5
                  name="road" 
                  size={20} 
                  color={focusedInput === 'logradouro' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRefs.logradouro}
                  style={styles.textInput}
                  placeholder="Rua, Avenida, etc."
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  onChangeText={(text) => cad('logradouro', text)}
                  value={formData.logradouro}
                  onFocus={() => handleInputFocus('logradouro')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>

            {/* Número e Complemento em linha */}
            <View style={styles.rowContainer}>
              {/* Número */}
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Número</Text>
                <View style={[
                  styles.textInputWrapper,
                  focusedInput === 'numero' && styles.inputFocused,
                  formData.numero && styles.inputValid
                ]}>
                  <MaterialCommunityIcons
                    name='home-outline' 
                    size={20} 
                    color={focusedInput === 'numero' ? '#186858ff' : '#999'} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={inputRefs.numero}
                    style={styles.textInput}
                    placeholder="123"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    keyboardType="numeric"
                    onChangeText={(text) => cad('numero', text)}
                    value={formData.numero}
                    onFocus={() => handleInputFocus('numero')}
                    onBlur={handleInputBlur}
                  />
                </View>
              </View>

              {/* Complemento */}
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 0 }]}>
                <Text style={styles.label}>Complemento</Text>
                <View style={[
                  styles.textInputWrapper,
                  focusedInput === 'complemento' && styles.inputFocused
                ]}>
                  <Ionicons 
                    name="business-outline" 
                    size={20} 
                    color={focusedInput === 'complemento' ? '#186858ff' : '#999'} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={inputRefs.complemento}
                    style={styles.textInput}
                    placeholder="Apto, Casa"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    onChangeText={(text) => cad('complemento', text)}
                    value={formData.complemento}
                    onFocus={() => handleInputFocus('complemento')}
                    onBlur={handleInputBlur}
                  />
                </View>
              </View>
            </View>

            {/* Campo Bairro */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bairro</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'bairro' && styles.inputFocused,
                formData.bairro && styles.inputValid
              ]}>
                <Ionicons 
                  name="navigate-outline" 
                  size={20} 
                  color={focusedInput === 'bairro' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRefs.bairro}
                  style={styles.textInput}
                  placeholder="Seu bairro"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  onChangeText={(text) => cad('bairro', text)}
                  value={formData.bairro}
                  onFocus={() => handleInputFocus('bairro')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>

            {/* Cidade e Estado em linha */}
            <View style={styles.rowContainer}>
              {/* Cidade */}
              <View style={[styles.inputContainer, { flex: 2, marginRight: 10 }]}>
                <Text style={styles.label}>Cidade</Text>
                <View style={[
                  styles.textInputWrapper,
                  focusedInput === 'cidade' && styles.inputFocused,
                  formData.cidade && styles.inputValid
                ]}>
                  <Ionicons 
                    name="business-outline" 
                    size={20} 
                    color={focusedInput === 'cidade' ? '#186858ff' : '#999'} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={inputRefs.cidade}
                    style={styles.textInput}
                    placeholder="Sua cidade"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    onChangeText={(text) => cad('cidade', text)}
                    value={formData.cidade}
                    onFocus={() => handleInputFocus('cidade')}
                    onBlur={handleInputBlur}
                  />
                </View>
              </View>

              {/* Estado */}
              <View style={[styles.inputContainer, { flex: 1,marginTop: -24,marginBottom: 20 }]}>
                <Text style={styles.label}>UF</Text>
                <View style={[
                  styles.textInputWrapper,
                  focusedInput === 'estado' && styles.inputFocused,
                  formData.estado && styles.inputValid
                ]}>
                  <Ionicons 
                    name="flag-outline" 
                    size={20} 
                    color={focusedInput === 'estado' ? '#186858ff' : '#999'} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput]}
                    placeholder="UF"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    onChangeText={(text) => cad('estado', text.toUpperCase())}
                    value={formData.estado}
                    onFocus={() => handleInputFocus('estado')}
                    onBlur={handleInputBlur}
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
              </View>
            </View>

            {/* Botão de continuar */}
            <TouchableOpacity 
              style={styles.botoes} 
              onPress={continuarCadastro} 
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
                    <Text style={styles.textBtn}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
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
    </LinearGradient>
  );
}