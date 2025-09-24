import React, { useState } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import { Ionicons } from '@expo/vector-icons';

export default function Cadastro({ navigation }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [formData, setFormData] = useState({
    nome: "", dataNasc: "", email: "", telefone: "", senha: "",
  });
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const cad = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

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
    
    cad('dataNasc', formatted);
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
    
    cad('telefone', formatted);
  };

  // Validar campos obrigatórios
  const validarCampos = () => {
    const { nome, dataNasc, email, telefone, senha } = formData;

    if (!nome || nome.length < 3) {
      Alert.alert('⚠️', 'Nome inválido');
      return false;
    }

    if (!dataNasc || dataNasc.length !== 10) {
      Alert.alert('⚠️', 'Data de nascimento inválida');
      return false;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      Alert.alert('⚠️', 'Email inválido');
      return false;
    }

    if (!telefone || telefone.length < 14) {
      Alert.alert('⚠️', 'Telefone inválido');
      return false;
    }

    if (!senha || senha.length < 8) {
      Alert.alert('⚠️', 'Senha deve ter pelo menos 8 caracteres');
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
      Alert.alert('✅', 'Dados pessoais salvos com sucesso!');
      
      // Navegar para próxima tela do cadastro (Cadastro2)
      navigation.navigate('Cadastro2');
      
    } catch (error) {
      console.log("❌ Erro ao salvar dados:", error);
      Alert.alert("❌", "Erro ao salvar dados pessoais");
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
                focusedInput === 'nome' && styles.inputFocused,
                formData.nome && styles.inputValid
              ]}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={focusedInput === 'nome' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Seu nome completo"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  onChangeText={(text) => cad('nome', text)}
                  value={formData.nome}
                  onFocus={() => handleInputFocus('nome')}
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
                focusedInput === 'email' && styles.inputFocused,
                formData.email && styles.inputValid
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={focusedInput === 'email' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="seu@email.com"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="email-address"
                  onChangeText={(text) => cad('email', text)}
                  value={formData.email}
                  onFocus={() => handleInputFocus('email')}
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
                focusedInput === 'dataNasc' && styles.inputFocused,
                formData.dataNasc && styles.inputValid
              ]}>
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color={focusedInput === 'dataNasc' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="numeric"
                  onChangeText={formatarDataNasc}
                  value={formData.dataNasc}
                  onFocus={() => handleInputFocus('dataNasc')}
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
                focusedInput === 'telefone' && styles.inputFocused,
                formData.telefone && styles.inputValid
              ]}>
                <Ionicons 
                  name="phone-portrait-outline" 
                  size={20} 
                  color={focusedInput === 'telefone' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="(11) 99999-9999"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="phone-pad"
                  onChangeText={formatarTelefone}
                  value={formData.telefone}
                  onFocus={() => handleInputFocus('telefone')}
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
                focusedInput === 'senha' && styles.inputFocused,
                formData.senha.length >= 8 && styles.inputValid
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedInput === 'senha' ? '#186858ff' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.senhaInput}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  secureTextEntry={!senhaVisivel}
                  onChangeText={(text) => cad('senha', text)}
                  value={formData.senha}
                  onFocus={() => handleInputFocus('senha')}
                  onBlur={handleInputBlur}
                  maxLength={8}
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
              <Text style={styles.passwordHint}>Mínimo 8 caracteres</Text>
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