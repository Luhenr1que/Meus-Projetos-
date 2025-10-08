import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../themeContext';
import getStyles from './style';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Dados locais em português como fallback
const ALIMENTOS_LOCAIS = {
  'arroz': [
    {
      id: '1',
      product_name: 'Arroz Branco Cozido',
      brands: 'TACO',
      category: 'Cereais e derivados',
      nutriments: {
        'energy-kcal_100g': 128,
        carbohydrates_100g: 28.1,
        proteins_100g: 2.5,
        fat_100g: 0.2,
        fiber_100g: 1.3
      }
    },
    {
      id: '2',
      product_name: 'Arroz Integral Cozido',
      brands: 'TACO',
      category: 'Cereais e derivados',
      nutriments: {
        'energy-kcal_100g': 124,
        carbohydrates_100g: 25.8,
        proteins_100g: 2.6,
        fat_100g: 1.0,
        fiber_100g: 2.7
      }
    }
  ],
  'frango': [
    {
      id: '3',
      product_name: 'Peito de Frango Grelhado',
      brands: 'TACO',
      category: 'Carnes e derivados',
      nutriments: {
        'energy-kcal_100g': 159,
        carbohydrates_100g: 0,
        proteins_100g: 31.0,
        fat_100g: 3.2
      }
    }
  ],
  'maçã': [
    {
      id: '4',
      product_name: 'Maçã Fuji',
      brands: 'TACO',
      category: 'Frutas',
      nutriments: {
        'energy-kcal_100g': 56,
        carbohydrates_100g: 14.1,
        proteins_100g: 0.3,
        fat_100g: 0.4,
        fiber_100g: 2.1
      }
    }
  ],
  'banana': [
    {
      id: '5',
      product_name: 'Banana Prata',
      brands: 'TACO',
      category: 'Frutas',
      nutriments: {
        'energy-kcal_100g': 98,
        carbohydrates_100g: 25.8,
        proteins_100g: 1.3,
        fat_100g: 0.1,
        fiber_100g: 2.6
      }
    }
  ]
};

export default function Alimentacao({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [alimentos, setAlimentos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

  // 🔍 Buscar alimentos - Estratégia melhorada
  const buscarAlimentos = async (termo) => {
    if (!termo.trim()) {
      Alert.alert('Atenção', 'Digite um alimento para pesquisar');
      return;
    }

    try {
      setCarregando(true);
      setPesquisaRealizada(true);
      console.log(`Buscando: ${termo}`);

      // Primeiro tenta dados locais
      const termoLower = termo.toLowerCase();
      let resultados = [];

      // Busca nos dados locais
      for (const [key, alimentosList] of Object.entries(ALIMENTOS_LOCAIS)) {
        if (termoLower.includes(key) || key.includes(termoLower)) {
          resultados = [...resultados, ...alimentosList];
        }
      }

      // Se não encontrou nos dados locais, tenta API externa
      if (resultados.length === 0) {
        resultados = await buscarNaAPIExterna(termo);
      }

      setAlimentos(resultados);

      if (resultados.length === 0) {
        Alert.alert(
          'Info',
          'Nenhum alimento encontrado. Tente termos mais comuns como: arroz, frango, maçã, banana, etc.'
        );
      }

    } catch (error) {
      console.log('❌ Erro ao buscar alimentos:', error);
      // Fallback para dados locais em caso de erro
      const termoLower = searchTerm.toLowerCase();
      const resultadosFallback = [];
      
      for (const [key, alimentosList] of Object.entries(ALIMENTOS_LOCAIS)) {
        if (termoLower.includes(key)) {
          resultadosFallback.push(...alimentosList);
        }
      }
      
      setAlimentos(resultadosFallback);
      
      if (resultadosFallback.length === 0) {
        Alert.alert(
          'Info',
          'Use termos em português como: arroz, frango, maçã, banana, pão, leite, etc.'
        );
      }
    } finally {
      setCarregando(false);
    }
  };

  // Buscar em API externa alternativa
  const buscarNaAPIExterna = async (termo) => {
    try {
      // Opção 1: Nutritionix API (mais confiável)
      const response = await axios.get(
        `https://trackapi.nutritionix.com/v2/search/instant`,
        {
          params: {
            query: termo,
            detailed: true
          },
          headers: {
            'x-app-id': 'seu-app-id', // Você precisa se registrar
            'x-app-key': 'seu-app-key',
          },
          timeout: 8000
        }
      );

      if (response.data && response.data.common) {
        return response.data.common.map(item => ({
          id: item.food_name,
          product_name: this.traduzirAlimento(item.food_name),
          brands: 'Nutritionix',
          nutriments: {
            'energy-kcal_100g': item.nf_calories,
            carbohydrates_100g: item.nf_total_carbohydrate,
            proteins_100g: item.nf_protein,
            fat_100g: item.nf_total_fat
          }
        }));
      }

      return [];
    } catch (error) {
      console.log('API externa falhou, usando dados locais');
      return [];
    }
  };

  // Função simples de tradução
  const traduzirAlimento = (nome) => {
    const traducoes = {
      'rice': 'Arroz',
      'chicken': 'Frango',
      'apple': 'Maçã',
      'banana': 'Banana',
      'bread': 'Pão',
      'milk': 'Leite',
      'egg': 'Ovo',
      'beef': 'Carne Bovina',
      'fish': 'Peixe',
      'pasta': 'Massa'
    };

    return traducoes[nome.toLowerCase()] || nome;
  };

  // Buscar alimentos genéricos baseados no termo
  const buscarAlimentosGenericos = (termo) => {
    const termoLower = termo.toLowerCase();
    const alimentosGenericos = [];

    if (termoLower.includes('arroz')) {
      alimentosGenericos.push(
        {
          id: 'arroz-branco',
          product_name: 'Arroz Branco Cozido',
          brands: 'TACO Brasil',
          category: 'Cereais',
          nutriments: {
            'energy-kcal_100g': 128,
            carbohydrates_100g: 28.1,
            proteins_100g: 2.5,
            fat_100g: 0.2,
            fiber_100g: 1.3
          }
        },
        {
          id: 'arroz-integral',
          product_name: 'Arroz Integral Cozido',
          brands: 'TACO Brasil',
          category: 'Cereais',
          nutriments: {
            'energy-kcal_100g': 124,
            carbohydrates_100g: 25.8,
            proteins_100g: 2.6,
            fat_100g: 1.0,
            fiber_100g: 2.7
          }
        }
      );
    }

    if (termoLower.includes('frango') || termoLower.includes('peito')) {
      alimentosGenericos.push(
        {
          id: 'frango-grelhado',
          product_name: 'Peito de Frango Grelhado',
          brands: 'TACO Brasil',
          category: 'Carnes',
          nutriments: {
            'energy-kcal_100g': 159,
            carbohydrates_100g: 0,
            proteins_100g: 31.0,
            fat_100g: 3.2
          }
        }
      );
    }

    // Adicione mais categorias conforme necessário...

    return alimentosGenericos;
  };

  const handleSearch = () => buscarAlimentos(searchTerm);

  const formatarNutriente = (valor) => {
    if (valor === undefined || valor === null) return 'N/A';
    return typeof valor === 'number' ? valor.toFixed(1) : valor;
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.cardAlimento, pressed && { opacity: 0.8 }]}
      onPress={() => navigation.navigate('DetalhesAlimento', { alimento: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.imagemPlaceholder}>
          <Ionicons name="nutrition" size={30} color="#059669" />
        </View>

        <View style={styles.infoBasica}>
          <Text style={styles.nomeAlimento} numberOfLines={2}>
            {item.product_name}
          </Text>
          <Text style={styles.marcaAlimento}>{item.brands}</Text>
          {item.category && (
            <Text style={styles.categoriaAlimento}>{item.category}</Text>
          )}
        </View>
      </View>

      <View style={styles.infoNutricional}>
        <View style={styles.nutrienteItem}>
          <Text style={styles.nutrienteLabel}>Calorias</Text>
          <Text style={styles.nutrienteValue}>
            {formatarNutriente(item.nutriments?.['energy-kcal_100g'])} kcal
          </Text>
        </View>

        <View style={styles.nutrienteItem}>
          <Text style={styles.nutrienteLabel}>Carboidratos</Text>
          <Text style={styles.nutrienteValue}>
            {formatarNutriente(item.nutriments?.carbohydrates_100g)} g
          </Text>
        </View>

        <View style={styles.nutrienteItem}>
          <Text style={styles.nutrienteLabel}>Proteínas</Text>
          <Text style={styles.nutrienteValue}>
            {formatarNutriente(item.nutriments?.proteins_100g)} g
          </Text>
        </View>

        <View style={styles.nutrienteItem}>
          <Text style={styles.nutrienteLabel}>Gorduras</Text>
          <Text style={styles.nutrienteValue}>
            {formatarNutriente(item.nutriments?.fat_100g)} g
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.infoPorcao}>Valores por 100g • Fonte: {item.brands}</Text>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={isDarkMode ? ['#1E293B', '#334155'] : ['#059669', '#10B981']}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.titulo}>Buscar Alimentos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ex: arroz, frango, maçã, banana, pão..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <Pressable
              style={({ pressed }) => [styles.clearButton, pressed && { opacity: 0.7 }]}
              onPress={() => setSearchTerm('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [styles.searchButton, pressed && { opacity: 0.8 }]}
          onPress={handleSearch}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="search" size={20} color="#FFFFFF" />
          )}
        </Pressable>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Buscando alimentos...</Text>
          </View>
        ) : pesquisaRealizada && alimentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#999" />
            <Text style={styles.emptyText}>Nenhum alimento encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente: arroz, frango, maçã, banana, pão, leite, ovo, etc.
            </Text>
          </View>
        ) : (
          <FlatList
            data={alimentos}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id || `alimento-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              alimentos.length > 0 && (
                <Text style={styles.resultadosText}>
                  {alimentos.length} alimento(s) encontrado(s)
                </Text>
              )
            }
          />
        )}

        {/* Dica inicial */}
        {!pesquisaRealizada && (
          <View style={styles.dicaContainer}>
            <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
            <Text style={styles.dicaText}>
              Digite alimentos em português como: arroz, frango, maçã, banana
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}