import React, { useState, useRef } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Cadastro3({ navigation, route }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // Receber dados da tela anterior se existirem
  const dadosAnteriores = route.params?.formData || {};
  
  const [formData, setFormData] = useState({
    ...dadosAnteriores,
    peso: "",
    altura: "",
    tipoSanguineo: ""
  });
  
  const [loading, setLoading] = useState(false);

  // Refs para os inputs
  const inputRefs = {
    peso: useRef(null),
    altura: useRef(null),
    tipoSanguineo: useRef(null)
  };

  const cad = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  // Formatar altura
  const formatarAltura = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 0) {
      if (cleaned.length <= 2) {
        cad("altura", cleaned + " m");
      } else {
        cad("altura", cleaned + " cm");
      }
    } else {
      cad("altura", "");
    }
  };

  // Formatar peso
  const formatarPeso = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 0) {
      cad("peso", cleaned + " kg");
    } else {
      cad("peso", "");
    }
  };

  // Tipos sanguíneos pré-definidos
  const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Validar campos obrigatórios
  const validarCampos = () => {
    const { peso, altura, tipoSanguineo } = formData;

    if (!peso || peso.length < 2) {
      Alert.alert('⚠️', 'Peso inválido');
      return false;
    }

    if (!altura || altura.length < 2) {
      Alert.alert('⚠️', 'Altura inválida');
      return false;
    }

    if (!tipoSanguineo || tipoSanguineo.length < 2) {
      Alert.alert('⚠️', 'Tipo sanguíneo inválido');
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
      Alert.alert('✅', 'Informações de saúde salvas com sucesso!');
      
      // Navegar para próxima tela do cadastro
      navigation.navigate('Cadastro4', { formData });
      
    } catch (error) {
      console.log("❌ Erro ao salvar dados:", error);
      Alert.alert("❌", "Erro ao salvar informações de saúde");
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
            <Text style={styles.titulo}>Informações de Saúde</Text>
            <Text style={styles.subtitle}>Informe seus dados de saúde</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo Peso */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Peso</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'peso' && styles.inputFocused,
                formData.peso && styles.inputValid
              ]}>
                <MaterialCommunityIcons
                  name="weight-kilogram" 
                  size={20} 
                  color={focusedInput === 'peso' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRefs.peso}
                  style={styles.textInput}
                  placeholder="70 kg"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="numeric"
                  onChangeText={formatarPeso}
                  value={formData.peso}
                  onFocus={() => handleInputFocus('peso')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>

            {/* Campo Altura */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Altura</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'altura' && styles.inputFocused,
                formData.altura && styles.inputValid
              ]}>
                <FontAwesome5
                  name="ruler-vertical" 
                  size={20} 
                  color={focusedInput === 'altura' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRefs.altura}
                  style={styles.textInput}
                  placeholder="175 cm"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="numeric"
                  onChangeText={formatarAltura}
                  value={formData.altura}
                  onFocus={() => handleInputFocus('altura')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>

            {/* Campo Tipo Sanguíneo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo Sanguíneo</Text>
              
              {/* Seletor horizontal de tipos sanguíneos */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 15 }}
              >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {tiposSanguineos.map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      onPress={() => cad('tipoSanguineo', tipo)}
                      style={[
                        styles.tipoSanguineoBtn,
                        formData.tipoSanguineo === tipo && styles.tipoSanguineoBtnSelected
                      ]}
                    >
                      <Text style={[
                        styles.tipoSanguineoText,
                        formData.tipoSanguineo === tipo && styles.tipoSanguineoTextSelected
                      ]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Input para tipo sanguíneo (como fallback) */}
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'tipoSanguineo' && styles.inputFocused,
                formData.tipoSanguineo && styles.inputValid
              ]}>
                <Ionicons 
                  name="water-outline" 
                  size={20} 
                  color={focusedInput === 'tipoSanguineo' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRefs.tipoSanguineo}
                  style={styles.textInput}
                  placeholder="A+, O-, etc."
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  onChangeText={(text) => cad('tipoSanguineo', text.toUpperCase())}
                  value={formData.tipoSanguineo}
                  onFocus={() => handleInputFocus('tipoSanguineo')}
                  onBlur={handleInputBlur}
                  maxLength={3}
                  autoCapitalize="characters"
                />
              </View>
              
              {formData.tipoSanguineo && (
                <Text style={styles.selecionadoText}>
                  Tipo sanguíneo selecionado: {formData.tipoSanguineo}
                </Text>
              )}
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