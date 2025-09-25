import React, { useState } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../../../../crud';

export default function Login({ navigation }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const { width, height } = Dimensions.get('window');

  const loginPaciente = useApi()

  const cad = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const logar = async () => {
    try {
      await loginPaciente.loginPaciente({ email: formData.email, senha: formData.senha });
      console.log('Login bem-sucedido:');
      // Navegar para a tela principal ou outra ação após o login
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      // Exibir mensagem de erro para o usuário
      alert('Erro ao fazer login: ' + error.message);
    }
  }

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
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo de Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'email' && styles.inputFocused,
                formData.email && styles.inputValid
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={focusedInput === 'email' ? '#6247AA' : '#999'} 
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

            {/* Campo de Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'senha' && styles.inputFocused,
                formData.senha.length >= 8 && styles.inputValid
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedInput === 'senha' ? '#6247AA' : '#999'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.senhaInput}
                  placeholder="Sua senha"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  maxLength={8}
                  secureTextEntry={!senhaVisivel}
                  onChangeText={(text) => cad("senha", text)}
                  value={formData.senha}
                  onFocus={() => handleInputFocus('senha')}
                  onBlur={handleInputBlur}
                />
                <TouchableOpacity 
                  onPress={() => setSenhaVisivel(!senhaVisivel)} 
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={senhaVisivel ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={isDarkMode ? '#fff' : '#666'} 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>Máximo 8 caracteres</Text>
            </View>

            {/* Link Esqueci a Senha */}
            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </Pressable>

            {/* Botão de login */}
            <TouchableOpacity onPress={()=>logar()} style={styles.loginButton}>
              <LinearGradient
                colors={['#6247AA', '#856BCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link para cadastro */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não tem uma conta?</Text>
              <Pressable onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.signupLink}>Crie uma</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}