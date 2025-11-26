import React, { useState, useEffect } from 'react';
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
  Modal,
  ScrollView,
  Keyboard,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../themeContext';
import getStyles from './style';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');

const popularTerms = [
  "pasta", "chicken", "salad", "soup", "cake", "bread", "rice", 
  "pizza", "fish", "beef", "vegetarian", "dessert", "breakfast", "dinner"
];

export default function Alimentacao({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // APIs disponíveis
  const MEALDB_URL = "https://www.themealdb.com/api/json/v1/1/search.php";
  const MEALDB_RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
  const MEALDB_CATEGORIES_URL = "https://www.themealdb.com/api/json/v1/1/categories.php";

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    fetchInitialRecipes();
  }, []);

  const fetchInitialRecipes = async () => {
    setCarregando(true);
    try {
      // Buscar algumas receitas aleatórias para início
      const randomPromises = Array(3).fill().map(() => 
        axios.get(MEALDB_RANDOM_URL)
      );
      
      const responses = await Promise.all(randomPromises);
      const allMeals = responses.flatMap(response => 
        response.data.meals || []
      );

      if (allMeals.length > 0) {
        const formattedRecipes = allMeals.map(formatMealToRecipe);
        setReceitas(formattedRecipes);
      } else {
        // Fallback para busca por termo popular
        const randomTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)];
        await buscarReceitas(randomTerm);
      }
    } catch (error) {
      console.error("Erro ao carregar receitas iniciais:", error);
      const randomTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)];
      await buscarReceitas(randomTerm);
    } finally {
      setCarregando(false);
    }
  };

  const formatMealToRecipe = (meal) => {
    if (!meal) return null;
    
    // Extrair ingredientes
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure || ''} ${ingredient}`.trim());
      }
    }

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      ingredients: ingredients.join('|'),
      instructions: meal.strInstructions,
      image: meal.strMealThumb,
      video: meal.strYoutube,
      source: meal.strSource,
      tags: meal.strTags,
      servings: '4', // Valor padrão pois a MealDB não fornece
      isMealDB: true
    };
  };

  const buscarReceitas = async (termo) => {
    if (!termo.trim()) {
      Alert.alert('Atenção', 'Digite um termo para pesquisar receitas');
      return;
    }

    try {
      setCarregando(true);
      setPesquisaRealizada(true);
      Keyboard.dismiss();

      const response = await axios.get(MEALDB_URL, {
        params: {
          s: termo
        },
        timeout: 10000,
      });

      if (response.data.meals && response.data.meals.length > 0) {
        const formattedRecipes = response.data.meals.map(formatMealToRecipe).filter(Boolean);
        setReceitas(formattedRecipes);
      } else {
        setReceitas([]);
        Alert.alert(
          'Nenhuma receita encontrada',
          'Tente outros termos como: pasta, chicken, salad, cake, etc.'
        );
      }

    } catch (error) {
      console.error("Erro na pesquisa de receitas:", error);
      
      if (error.code === 'ECONNABORTED') {
        Alert.alert(
          'Timeout',
          'A requisição demorou muito. Verifique sua conexão com a internet.'
        );
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível buscar as receitas. Tente novamente.'
        );
      }
      setReceitas([]);
    } finally {
      setCarregando(false);
    }
  };

  const fetchRecipeDetails = async (recipe) => {
    setDetailsLoading(true);
    setModalVisible(true);
    
    // Se já temos todos os dados da MealDB, usa diretamente
    if (recipe.isMealDB) {
      setRecipeDetails(recipe);
      setDetailsLoading(false);
      return;
    }

    // Caso precise buscar detalhes adicionais (para outras APIs)
    try {
      // Aqui você pode implementar busca adicional se necessário
      setRecipeDetails(recipe);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      setRecipeDetails(recipe);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSearch = () => buscarReceitas(searchTerm);

  const formatarIngredientes = (ingredients) => {
    if (!ingredients) return [];
    return ingredients.split('|').filter(ing => ing.trim() !== '');
  };

  const formatarInstrucoes = (instructions) => {
    if (!instructions) return [];
    // Dividir por quebras de linha e pontos
    return instructions
      .split(/\r\n|\n|\r|\. /)
      .filter(step => step.trim() !== '' && step.trim().length > 10);
  };

  const abrirVideo = (videoUrl) => {
    if (videoUrl) {
      Linking.openURL(videoUrl);
    } else {
      Alert.alert('Info', 'Vídeo não disponível para esta receita');
    }
  };

  const abrirFonte = (sourceUrl) => {
    if (sourceUrl) {
      Linking.openURL(sourceUrl);
    } else {
      Alert.alert('Info', 'Fonte original não disponível');
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.cardAlimento, pressed && styles.cardPressed]}
      onPress={() => fetchRecipeDetails(item)}
    >
      <View style={styles.cardHeader}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.imagemAlimento}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagemPlaceholder}>
            <Ionicons name="restaurant" size={30} color="#059669" />
          </View>
        )}

        <View style={styles.infoBasica}>
          <Text style={styles.nomeAlimento} numberOfLines={2}>
            {item.title || "Receita sem nome"}
          </Text>
          <Text style={styles.marcaAlimento}>
            {item.category ? `${item.category}` : "Categoria não especificada"}
            {item.area ? ` • ${item.area}` : ''}
          </Text>
          <Text style={styles.categoriaAlimento}>
            {item.ingredients ? `${formatarIngredientes(item.ingredients).length} ingredientes` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.infoNutricional}>
        <View style={styles.nutrienteItem}>
          <Text style={styles.nutrienteLabel}>Porções</Text>
          <Text style={styles.nutrienteValue}>
            {item.servings || '4'}
          </Text>
        </View>

        <View style={styles.nutrienteItem}>
          <Text style={styles.nutrienteLabel}>Ingredientes</Text>
          <Text style={styles.nutrienteValue}>
            {item.ingredients ? formatarIngredientes(item.ingredients).length : 'N/A'}
          </Text>
        </View>

        <View style={styles.nutrienteItem}>
          <Text style={styles.nutrienteLabel}>Dificuldade</Text>
          <Text style={styles.nutrienteValue}>
            {item.ingredients ? 
              (formatarIngredientes(item.ingredients).length <= 5 ? 'Fácil' : 
               formatarIngredientes(item.ingredients).length <= 10 ? 'Médio' : 'Difícil') 
              : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.infoPorcao}>
          {item.ingredients ? `Ingredientes: ${formatarIngredientes(item.ingredients).length}` : ''} 
          • Fonte: TheMealDB
        </Text>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={isDarkMode ? ['#1E293B', '#334155'] : ['#059669', '#10B981']}
      style={styles.gradientContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.titulo}>Buscar Receitas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ex: pasta, chicken, salad, cake, soup..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <Pressable
              style={({ pressed }) => [styles.clearButton, pressed && styles.buttonPressed]}
              onPress={() => setSearchTerm('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [styles.searchButton, pressed && styles.buttonPressed]}
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

      {/* Aviso sobre termos em inglês */}
      <View style={styles.warningContainer}>
        <Ionicons name="information-circle" size={20} color="#F59E0B" />
        <Text style={styles.warningText}>
          Digite termos em inglês para melhores resultados
        </Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Buscando receitas...</Text>
          </View>
        ) : pesquisaRealizada && receitas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color="#999" />
            <Text style={styles.emptyText}>Nenhuma receita encontrada</Text>
            <Text style={styles.emptySubtext}>
              Tente termos em inglês: pasta, chicken, salad, cake, soup, pizza, etc.
            </Text>
          </View>
        ) : (
          <FlatList
            data={receitas}
            renderItem={renderItem}
            keyExtractor={(item) => `receita-${item.id}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer,
              keyboardVisible && styles.keyboardOpenList,
            ]}
            ListHeaderComponent={
              receitas.length > 0 && (
                <Text style={styles.resultadosText}>
                  {receitas.length} receita(s) encontrada(s) via TheMealDB
                </Text>
              )
            }
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Dica inicial */}
        {!pesquisaRealizada && (
          <View style={styles.dicaContainer}>
            <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
            <Text style={styles.dicaText}>
              Digite termos culinários em inglês: pasta, chicken, salad, cake, soup, pizza, etc.
            </Text>
          </View>
        )}
      </View>

      {/* Modal de Detalhes da Receita */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {detailsLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={styles.modalLoadingText}>
                  Carregando receita...
                </Text>
              </View>
            ) : recipeDetails ? (
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle} numberOfLines={2}>
                    {recipeDetails.title || "Receita sem nome"}
                  </Text>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>

                {recipeDetails.image && (
                  <Image
                    source={{ uri: recipeDetails.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Informações da Receita</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Categoria:</Text>
                    <Text style={styles.detailValue}>
                      {recipeDetails.category || 'Não especificada'}
                    </Text>
                  </View>

                  {recipeDetails.area && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Culinária:</Text>
                      <Text style={styles.detailValue}>
                        {recipeDetails.area}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Porções:</Text>
                    <Text style={styles.detailValue}>
                      {recipeDetails.servings || '4'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dificuldade:</Text>
                    <Text style={styles.detailValue}>
                      {recipeDetails.ingredients ? 
                        (formatarIngredientes(recipeDetails.ingredients).length <= 5 ? 'Fácil' : 
                         formatarIngredientes(recipeDetails.ingredients).length <= 10 ? 'Médio' : 'Difícil') 
                        : 'Não disponível'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Ingredientes</Text>
                  {recipeDetails.ingredients ? (
                    formatarIngredientes(recipeDetails.ingredients).map((ingrediente, index) => (
                      <View key={index} style={styles.ingredientItem}>
                        <Text style={styles.ingredientBullet}>•</Text>
                        <Text style={styles.ingredientText}>{ingrediente.trim()}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>Ingredientes não disponíveis</Text>
                  )}
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Instruções</Text>
                  {recipeDetails.instructions ? (
                    formatarInstrucoes(recipeDetails.instructions).map((instrucao, index) => (
                      <View key={index} style={styles.instructionItem}>
                        <Text style={styles.instructionStep}>{index + 1}.</Text>
                        <Text style={styles.instructionText}>{instrucao.trim()}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>Instruções não disponíveis</Text>
                  )}
                </View>

                {/* Botões de ação */}
                <View style={styles.actionsContainer}>
                  {recipeDetails.video && (
                    <Pressable
                      style={[styles.actionButton, styles.videoButton]}
                      onPress={() => abrirVideo(recipeDetails.video)}
                    >
                      <Ionicons name="play-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Assistir Vídeo</Text>
                    </Pressable>
                  )}
                  
                  {recipeDetails.source && (
                    <Pressable
                      style={[styles.actionButton, styles.sourceButton]}
                      onPress={() => abrirFonte(recipeDetails.source)}
                    >
                      <Ionicons name="link" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Fonte Original</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.dataSourceInfo}>
                  <Text style={styles.dataSourceText}>
                    🍳 Receita fornecida pela TheMealDB API
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.modalLoading}>
                <Text style={styles.errorText}>
                  Erro ao carregar informações da receita.
                </Text>
                <Pressable
                  style={styles.retryButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.retryButtonText}>Fechar</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}