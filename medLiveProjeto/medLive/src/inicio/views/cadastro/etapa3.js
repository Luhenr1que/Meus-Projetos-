import React, { useState, useRef } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// ✅ CORREÇÃO: Importar o contexto
import { useCadastro } from '../../../contexts/CadastroContext';

export default function Cadastro3({ navigation, route }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // ✅ CORREÇÃO: Usar o contexto em vez de estado local
  const { dadosCadastro, atualizarDados } = useCadastro();

  const [loading, setLoading] = useState(false);

  // Refs para os inputs
  const inputRefs = {
    peso: useRef(null),
    altura: useRef(null),
    tipoSanguineo: useRef(null)
  };

  // ✅ CORREÇÃO: Atualizar direto no contexto
  const cad = (field, value) => {
    atualizarDados({ [field]: value });
  };

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  // ✅ CORREÇÃO: Salvar altura exatamente como digitado
  const handleAlturaChange = (text) => {
    cad("altura", text); // Salva exatamente o que foi digitado
  };

  // ✅ CORREÇÃO: Salvar peso exatamente como digitado
  const handlePesoChange = (text) => {
    cad("peso", text); // Salva exatamente o que foi digitado
  };

  // Tipos sanguíneos pré-definidos
  const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Validar campos obrigatórios
  const validarCampos = () => {
    const { peso, altura, tipoSanguineo } = dadosCadastro;

    if (!peso || peso.trim().length === 0) {
      Alert.alert('⚠️', 'Peso é obrigatório');
      return false;
    }

    if (!altura || altura.trim().length === 0) {
      Alert.alert('⚠️', 'Altura é obrigatória');
      return false;
    }

    if (!tipoSanguineo || tipoSanguineo.length < 2) {
      Alert.alert('⚠️', 'Tipo sanguíneo é obrigatório');
      return false;
    }

    // ✅ CORREÇÃO: Validações mais flexíveis
    const pesoNum = parseFloat(peso.replace(',', '.')); // Suporta decimal
    const alturaNum = parseFloat(altura.replace(',', '.')); // Suporta decimal

    if (isNaN(pesoNum) || pesoNum < 1 || pesoNum > 300) {
      Alert.alert('⚠️', 'Peso deve ser um número entre 1 e 300');
      return false;
    }

    if (isNaN(alturaNum) || alturaNum < 0.5 || alturaNum > 2.5) {
      Alert.alert('⚠️', 'Altura deve ser um número entre 0.5 e 2.5 metros');
      return false;
    }

    return true;
  };

  // ✅ CORREÇÃO: Função simplificada
  const continuarCadastro = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);
      
      console.log('📋 Dados de saúde salvos (exatamente como digitado):', {
        peso: dadosCadastro.peso,
        altura: dadosCadastro.altura,
        tipoSanguineo: dadosCadastro.tipoSanguineo
      });
      
      // ✅ CORREÇÃO: Navegar sem duplicar dados
      navigation.navigate('Cadastro4');
      
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
                dadosCadastro.peso && styles.inputValid
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
                  placeholder="Ex: 70, 70.5, 68.2"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="decimal-pad" // ✅ Permite números decimais
                  onChangeText={handlePesoChange}
                  value={dadosCadastro.peso || ""} // ✅ Mostra exatamente o que foi salvo
                  onFocus={() => handleInputFocus('peso')}
                  onBlur={handleInputBlur}
                />
              </View>
              {dadosCadastro.peso && (
                <Text style={styles.helperText}>
                  Salvo: {dadosCadastro.peso} (exatamente como digitado)
                </Text>
              )}
            </View>

            {/* Campo Altura */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Altura</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'altura' && styles.inputFocused,
                dadosCadastro.altura && styles.inputValid
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
                  placeholder="Ex: 1.75, 1.80, 165 cm"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="decimal-pad" // ✅ Permite números decimais
                  onChangeText={handleAlturaChange}
                  value={dadosCadastro.altura || ""} // ✅ Mostra exatamente o que foi salvo
                  onFocus={() => handleInputFocus('altura')}
                  onBlur={handleInputBlur}
                />
              </View>
              {dadosCadastro.altura && (
                <Text style={styles.helperText}>
                  Salvo: {dadosCadastro.altura} (exatamente como digitado)
                </Text>
              )}
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
                        dadosCadastro.tipoSanguineo === tipo && styles.tipoSanguineoBtnSelected
                      ]}
                    >
                      <Text style={[
                        styles.tipoSanguineoText,
                        dadosCadastro.tipoSanguineo === tipo && styles.tipoSanguineoTextSelected
                      ]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Input para tipo sanguíneo */}
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'tipoSanguineo' && styles.inputFocused,
                dadosCadastro.tipoSanguineo && styles.inputValid
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
                  value={dadosCadastro.tipoSanguineo || ""}
                  onFocus={() => handleInputFocus('tipoSanguineo')}
                  onBlur={handleInputBlur}
                  maxLength={3}
                  autoCapitalize="characters"
                />
              </View>
              
              {dadosCadastro.tipoSanguineo && (
                <Text style={styles.selecionadoText}>
                  Tipo sanguíneo selecionado: {dadosCadastro.tipoSanguineo}
                </Text>
              )}
            </View>

            {/* Instruções */}
            <View style={styles.instrucoesContainer}>
              <Text style={styles.instrucoesTitulo}>💡 Como preencher:</Text>
              <Text style={styles.instrucoesTexto}>• Peso: Digite o valor em kg (ex: 70, 68.5, 75.2)</Text>
              <Text style={styles.instrucoesTexto}>• Altura: Digite em metros (1.75) ou centímetros (175)</Text>
              <Text style={styles.instrucoesTexto}>• O sistema aceita números decimais usando ponto ou vírgula</Text>
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