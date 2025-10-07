import React, { useState, useRef } from 'react';
import { View, ScrollView, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../themeContext';
import getStyles from './style';
import { useCadastro } from '../../../contexts/CadastroContext';
import { useApi } from '../../../../crud';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Cadastro3({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { dadosCadastro, atualizarDados } = useCadastro();
  const { cadastrarPaciente } = useApi();

  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const inputRefs = {
    peso: useRef(null),
    altura: useRef(null),
    tipoSanguineo: useRef(null)
  };

  const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const cad = (field, value) => atualizarDados({ [field]: value });

  const validarCampos = () => {
    const { peso, altura, tipoSanguineo, nomePaciente, emailPaciente, telefonePaciente, senhaPaciente, dataNascimento } = dadosCadastro;

    if (!nomePaciente || !emailPaciente || !telefonePaciente || !senhaPaciente || !dataNascimento) {
      Alert.alert('⚠️', 'Preencha todos os campos obrigatórios.');
      return false;
    }

    const pesoNum = parseFloat(peso.replace(',', '.'));
    const alturaNum = parseFloat(altura.replace(',', '.'));
    if (isNaN(pesoNum) || pesoNum < 1 || pesoNum > 300) { Alert.alert('⚠️', 'Peso inválido'); return false; }
    if (isNaN(alturaNum) || alturaNum < 0.5 || alturaNum > 2.5) { Alert.alert('⚠️', 'Altura inválida'); return false; }
    if (!tipoSanguineo || tipoSanguineo.length < 2) { Alert.alert('⚠️', 'Tipo sanguíneo obrigatório'); return false; }

    return true;
  };

  const finalizarCadastro = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(dadosCadastro).forEach(key => {
        if (dadosCadastro[key] != null) formData.append(key, String(dadosCadastro[key]));
      });

      const response = await cadastrarPaciente(formData);
      console.log('✅ Cadastro realizado:', response);

      // Salva id do paciente para uso no Cadastro4
      atualizarDados({ idPaciente: response.paciente.idPaciente });

      // Navegar para Cadastro4
      navigation.navigate('Cadastro4');

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao cadastrar paciente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={isDarkMode ? ['#2D1B69', '#6247AA'] : ['#6247AA', '#856BCC']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.titulo}>Informações de Saúde</Text>
          <Text style={styles.subtitle}>Preencha seus dados de saúde para continuar</Text>

          {/* Peso */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Peso</Text>
            <View style={[styles.textInputWrapper, focusedInput === 'peso' && styles.inputFocused]}>
              <MaterialCommunityIcons name="weight-kilogram" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                ref={inputRefs.peso}
                style={styles.textInput}
                placeholder="Ex: 70, 70.5"
                placeholderTextColor={isDarkMode ? '#888' : '#666'}
                keyboardType="decimal-pad"
                onChangeText={text => cad('peso', text)}
                value={dadosCadastro.peso || ''}
                onFocus={() => setFocusedInput('peso')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Altura */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Altura</Text>
            <View style={[styles.textInputWrapper, focusedInput === 'altura' && styles.inputFocused]}>
              <FontAwesome5 name="ruler-vertical" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                ref={inputRefs.altura}
                style={styles.textInput}
                placeholder="Ex: 1.75"
                placeholderTextColor={isDarkMode ? '#888' : '#666'}
                keyboardType="decimal-pad"
                onChangeText={text => cad('altura', text)}
                value={dadosCadastro.altura || ''}
                onFocus={() => setFocusedInput('altura')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Tipo Sanguíneo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo Sanguíneo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {tiposSanguineos.map(tipo => (
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
                  ]}>{tipo}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Botão Finalizar */}
          <TouchableOpacity onPress={finalizarCadastro} disabled={loading}>
            <LinearGradient colors={['#6247AA', '#856BCC']} style={[styles.botoes, loading && { opacity: 0.7 }]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textBtn}>Finalizar Cadastro</Text>}
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}
