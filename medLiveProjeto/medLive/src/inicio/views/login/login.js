import React, { useState } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Image, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';

export default function Login({ navigation }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const { width, height } = Dimensions.get('window');

  const cad = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <View style={{ flex: 1, width: '100%', backgroundColor: '#6247AA' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image source={require('../../../../assets/img/medLiveLogo.png')} style={{width:width*0.65,height:height*0.26,marginTop:20,}}></Image>

          {/* Campo de Email */}
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

          {/* Campo de Senha */}
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
            <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)} style={styles.olhoBotao} />
          </View>

          {/* Link para cadastro */}
          <View style={styles.login}>
            <Text style={styles.loginText}>{'Não tem uma conta?'}</Text>
            <Pressable onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.loginbtn}>{'Crie uma.'}</Text>
            </Pressable>
          </View>

          {/* Botão de login */}
          <Pressable style={styles.btn}>
            <LinearGradient
              colors={['#6247AA', '#856bccff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.textBtn}>Entrar</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
