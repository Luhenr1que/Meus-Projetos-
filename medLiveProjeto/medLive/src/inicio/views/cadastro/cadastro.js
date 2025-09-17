import React, { useState } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';

export default function Cadastro({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { width, height } = Dimensions.get('window');

  const [formData, setFormData] = useState({
    nome: "", dataNasc: "", email: "", telefone: "", senha: "",
  });
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const cad = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <View style={{backgroundColor: '#3b3b3bff' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}


        <View style={styles.container}>
          <Image 
          source={require('../../../../assets/img/medLiveLogo.png')} 
          style={{width: width*0.65, height: height*0.26, marginTop: 20}}
        />
          {/* Nome */}
          <View style={styles.text}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: isDarkMode ? '#fff' : '#000' }}>
              Nome
            </Text>
            <TextInput
              style={[styles.textInput, { borderBottomColor: formData.nome ? 'green' : '#713205' }]}
              placeholderTextColor={isDarkMode ? '#fff' : '#131F3C'}
              onChangeText={(text) => cad('nome', text)}
              value={formData.nome}
            />
          </View>

          {/* Email */}
          <View style={styles.text}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: isDarkMode ? '#fff' : '#000' }}>
              Email
            </Text>
            <TextInput
              style={[styles.textInput, { borderBottomColor: formData.email ? 'green' : '#713205' }]}
              placeholderTextColor={isDarkMode ? '#fff' : '#131F3C'}
              keyboardType="email-address"
              onChangeText={(text) => cad('email', text)}
              value={formData.email}
            />
          </View>

          {/* Data de Nascimento */}
          <View style={styles.text}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: isDarkMode ? '#fff' : '#000' }}>
              Data de Nascimento
            </Text>
            <TextInput
              style={[styles.textInput, { borderBottomColor: formData.dataNasc ? 'green' : '#713205' }]}
              placeholderTextColor={isDarkMode ? '#fff' : '#131F3C'}
              onChangeText={(text) => cad('dataNasc', text)}
              value={formData.dataNasc}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Telefone */}
          <View style={styles.text}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: isDarkMode ? '#fff' : '#000' }}>
              Telefone
            </Text>
            <TextInput
              style={[styles.textInput, { borderBottomColor: formData.telefone ? 'green' : '#713205' }]}
              placeholderTextColor={isDarkMode ? '#fff' : '#131F3C'}
              onChangeText={(text) => cad('telefone', text)}
              value={formData.telefone}
              keyboardType="phone-pad"
              maxLength={20}
            />
          </View>

          {/* Senha */}
          <View style={[styles.text, styles.senhaContainer]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: isDarkMode ? '#fff' : '#000' }}>
                Senha
              </Text>
              <TextInput
                style={[styles.senhaInput, { borderColor: formData.senha.length >= 8 ? 'green' : '#713205' }]}
                maxLength={8}
                secureTextEntry={!senhaVisivel}
                placeholderTextColor={isDarkMode ? "#fff" : "#131F3C"}
                onChangeText={(text) => cad("senha", text)}
                value={formData.senha}
              />
            </View>
            <Pressable 
              onPress={() => setSenhaVisivel(!senhaVisivel)} 
              style={styles.olhoBotao} 
            />
          </View>

          {/* Link para login */}
          <View style={styles.login}>
            <Text style={styles.loginText}>{'Já tem uma conta?'}</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginbtn}>{'Faça login.'}</Text>
            </Pressable>
          </View>

          {/* Botão de cadastro */}
          <Pressable style={styles.btn}>
            <LinearGradient
              colors={['#6247AA', '#856bccff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.textBtn}>Cadastrar</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}