import React, { useState } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import { Ionicons } from '@expo/vector-icons';

// Importe os contexts
import { useCadastro } from '../../../contexts/CadastroContext';

export default function Cadastro({ navigation }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // Use o contexto de cadastro em vez do estado local
  const { dadosCadastro, atualizarDados } = useCadastro();

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para atualizar dados no contexto
  const cad = (field, value) => {
    atualizarDados({ [field]: value });
  };

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  // Formatar data de nascimento
  const formatarDataNasc = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    if (cleaned.length > 4) {
      formatted = formatted + '/' + cleaned.slice(4, 8);
    }
    
    cad('dataNascimento', formatted);
  };

  // Formatar telefone
  const formatarTelefone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 7);
    }
    if (cleaned.length > 7) {
      formatted = formatted + '-' + cleaned.slice(7, 11);
    }
    
    cad('telefonePaciente', formatted);
  };

  // Validar campos obrigatórios
  const validarCampos = () => {
    const { nomePaciente, dataNascimento, emailPaciente, telefonePaciente, senhaPaciente } = dadosCadastro;

     console.log("Verificando campos:", dadosCadastro); // Debug dos dados
    if (!nomePaciente || nomePaciente.length < 3) {
      Alert.alert('⚠️', 'Nome inválido');
      return false;
    }

    if (!dataNascimento || dataNascimento.length !== 10) {
      Alert.alert('⚠️', 'Data de nascimento inválida');
      return false;
    }

    if (!emailPaciente || !emailPaciente.includes('@') || !emailPaciente.includes('.')) {
      Alert.alert('⚠️', 'Email inválido');
      return false;
    }

    if (!telefonePaciente || telefonePaciente.length < 14) {
      Alert.alert('⚠️', 'Telefone inválido');
      return false;
    }

    if (!senhaPaciente || senhaPaciente.length < 4) { // Mudei para 4 conforme sua API
      Alert.alert('⚠️', 'Senha deve ter pelo menos 4 caracteres');
      return false;
    }

    return true;
  };

  // Função para continuar o cadastro
  const continuarCadastro = async () => {
    if (!validarCampos()) {
      console.log('deu erro')
      return
    };
    

    try {
      setLoading(true);
      
      // Converter data de DD/MM/AAAA para AAAA-MM-DD (formato da API)
      const dataFormatada = converterDataParaAPI(dadosCadastro.dataNascimento);
      
      // Atualizar a data no formato correto
      atualizarDados({ dataNascimento: dataFormatada });
      
      Alert.alert('✅', 'Dados pessoais salvos!');
      
      // Navegar para próxima tela do cadastro
      navigation.navigate('Cadastro2');
      
    } catch (error) {
      console.log("❌ Erro:", error);
      Alert.alert("❌", "Erro ao salvar dados");
    } finally {
      setLoading(false);
    }
  };

  // Função para converter data
  const converterDataParaAPI = (dataDDMMAAAA) => {
    if (!dataDDMMAAAA) return '';
    
    const partes = dataDDMMAAAA.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`; // AAAA-MM-DD
    }
    return dataDDMMAAAA;
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#2D1B69', '#6247AA'] : ['#6247AA', '#856BCC']}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
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
            <Text style={styles.titulo}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados pessoais</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo Nome */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'nomePaciente' && styles.inputFocused,
                dadosCadastro.nomePaciente && styles.inputValid
              ]}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={focusedInput === 'nomePaciente' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Seu nome completo"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  onChangeText={(text) => cad('nomePaciente', text)}
                  value={dadosCadastro.nomePaciente}
                  onFocus={() => handleInputFocus('nomePaciente')}
                  onBlur={handleInputBlur}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'emailPaciente' && styles.inputFocused,
                dadosCadastro.emailPaciente && styles.inputValid
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={focusedInput === 'emailPaciente' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="seu@email.com"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="email-address"
                  onChangeText={(text) => cad('emailPaciente', text)}
                  value={dadosCadastro.emailPaciente}
                  onFocus={() => handleInputFocus('emailPaciente')}
                  onBlur={handleInputBlur}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Campo Data de Nascimento */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'dataNascimento' && styles.inputFocused,
                dadosCadastro.dataNascimento && styles.inputValid
              ]}>
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color={focusedInput === 'dataNascimento' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="numeric"
                  onChangeText={formatarDataNasc}
                  value={dadosCadastro.dataNascimento}
                  onFocus={() => handleInputFocus('dataNascimento')}
                  onBlur={handleInputBlur}
                  maxLength={10}
                />
              </View>
            </View>

            {/* Campo Telefone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Telefone</Text>
              <View style={[
                styles.textInputWrapper,
                focusedInput === 'telefonePaciente' && styles.inputFocused,
                dadosCadastro.telefonePaciente && styles.inputValid
              ]}>
                <Ionicons 
                  name="phone-portrait-outline" 
                  size={20} 
                  color={focusedInput === 'telefonePaciente' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="(11) 99999-9999"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="phone-pad"
                  onChangeText={formatarTelefone}
                  value={dadosCadastro.telefonePaciente}
                  onFocus={() => handleInputFocus('telefonePaciente')}
                  onBlur={handleInputBlur}
                  maxLength={15}
                />
              </View>
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={[
                styles.senhaWrapper,
                focusedInput === 'senhaPaciente' && styles.inputFocused,
                dadosCadastro.senhaPaciente.length >= 4 && styles.inputValid
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedInput === 'senhaPaciente' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.senhaInput}
                  placeholder="Mínimo 4 caracteres"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  secureTextEntry={!senhaVisivel}
                  onChangeText={(text) => cad('senhaPaciente', text)}
                  value={dadosCadastro.senhaPaciente}
                  onFocus={() => handleInputFocus('senhaPaciente')}
                  onBlur={handleInputBlur}
                />
                <TouchableOpacity 
                  onPress={() => setSenhaVisivel(!senhaVisivel)} 
                  style={styles.olhoBotao}
                >
                  <Ionicons 
                    name={senhaVisivel ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={isDarkMode ? '#fff' : '#666'} 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>Mínimo 4 caracteres</Text>
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

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link para login */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Já tem uma conta?</Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signupLink}>Faça login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}