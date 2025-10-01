import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Pressable, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useTheme } from '../../../themeContext';
import getStyles from './style';
import { Ionicons, MaterialCommunityIcons, FontAwesome6, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
    const { isDarkMode } = useTheme();
    const styles = getStyles(isDarkMode);
    const [menuAberto, setMenuAberto] = useState(false);
    const [dicaDoDia, setDicaDoDia] = useState('Carregando dica do dia...');
    const [carregando, setCarregando] = useState(true);

    const carregarTodasFrases = async () => {
        try {
            setCarregando(true);
            
            console.log('Buscando todas as frases...');
            
            const response = await axios.get('https://frases.docapi.dev/frase/obter', {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Resposta completa da API:', response.data);
            
            if (response.data && response.data.resposta && Array.isArray(response.data.resposta)) {
                // Filtra frases válidas (não vazias e não são "Test")
                const frasesValidas = response.data.resposta.filter(frase => 
                    frase.frase && 
                    frase.frase.trim() !== '' && 
                    frase.frase !== 'Test'
                );
                
                console.log(`Encontradas ${frasesValidas.length} frases válidas`);
                
                if (frasesValidas.length > 0) {
                    // Seleciona uma frase aleatória
                    const fraseAleatoria = frasesValidas[Math.floor(Math.random() * frasesValidas.length)];
                    const autor = fraseAleatoria.nomeAutor ? ` - ${fraseAleatoria.nomeAutor}` : '';
                    setDicaDoDia(`${fraseAleatoria.frase}${autor}`);
                    console.log('Frase selecionada:', fraseAleatoria);
                } else {
                    throw new Error('Nenhuma frase válida encontrada');
                }
            } else {
                throw new Error('Estrutura de dados inesperada');
            }
            
        } catch (error) {
            console.log('❌ Erro ao carregar frases:', error);
            
            // Fallback com frases de saúde em português
            const frasesFallback = [
                "Cuide da sua saúde todos os dias! 💪",
                "Beba água e mantenha-se hidratado! 💧",
                "Respire fundo e relaxe! 🌬️",
                "Movimente-se! Seu corpo agradece! 🏃‍♂️",
                "Durma bem para recarregar as energias! 😴",
                "Alimente-se com qualidade e amor! 🍎",
                "A saúde é nosso maior tesouro! 💎",
                "Pequenos cuidados diários fazem grande diferença! 🌟",
                "Cuide da mente e do corpo com igual atenção! 🧠💪",
                "Hoje é um novo dia para ser mais saudável! 🌈"
            ];
            
            const fraseAleatoria = frasesFallback[Math.floor(Math.random() * frasesFallback.length)];
            setDicaDoDia(fraseAleatoria);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarTodasFrases();
        
        // Recarregar a cada 6 horas
        const intervalo = setInterval(() => {
            carregarTodasFrases();
        }, 6 * 60 * 60 * 1000);
        
        return () => clearInterval(intervalo);
    }, []);

    const botoesGrade = [
        {
            id: 1,
            nome: 'Calcular IMC',
            color: ['#059669', '#10B981'],
            icone: <MaterialCommunityIcons name='calculator' size={45} color="#FFFFFF" />,
            tela: 'IMC'
        },
        {
            id: 2,
            nome: 'Tipo Sanguíneo',
            color: ['#DC2626', '#EF4444'],
            icone: <FontAwesome6 name='droplet' size={40} color="#FFFFFF" />,
            tela: 'TipoSanguineo'
        },
        {
            id: 3,
            nome: 'Água',
            color: ['#2563EB', '#3B82F6'],
            icone: <FontAwesome5 name='glass-whiskey' size={40} color="#FFFFFF" />,
            tela: 'Agua'
        },
        {
            id: 4,
            nome: 'Alimentação',
            color: ['#D97706', '#F59E0B'],
            icone: <MaterialCommunityIcons name='food-apple' size={45} color="#FFFFFF" />,
            tela: 'Alimentacao'
        },
        {
            id: 5,
            nome: 'Meditação',
            color: ['#7C3AED', '#8B5CF6'],
            icone: <MaterialCommunityIcons name='meditation' size={45} color="#FFFFFF" />,
            tela: 'Meditacao'
        },
        {
            id: 6,
            nome: 'Exercícios',
            color: ['#0369A1', '#0EA5E9'],
            icone: <MaterialCommunityIcons name='run' size={45} color="#FFFFFF" />,
            tela: 'Exercicios'
        },
        {
            id: 7,
            nome: 'Sono',
            color: ['#475569', '#64748B'],
            icone: <Ionicons name='bed' size={45} color="#FFFFFF" />,
            tela: 'Sono'
        },
        {
            id: 8,
            nome: 'Doação Sangue',
            color: ['#DC2626', '#EF4444'],
            icone: <FontAwesome6 name='hand-holding-heart' size={40} color="#FFFFFF" />,
            tela: 'DoacaoSangue'
        },
        {
            id: 9,
            nome: 'Emergência',
            color: ['#DC2626', '#EF4444'],
            icone: <Ionicons name='alert-circle' size={45} color="#FFFFFF" />,
            acao: 'emergencia'
        },
        {
            id: 10,
            nome: 'Meu Perfil',
            color: ['#C026D3', '#D946EF'],
            icone: <Ionicons name='person' size={45} color="#FFFFFF" />,
            tela: 'Perfil'
        },
    ];

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const navegarParaTela = (tela) => {
        setMenuAberto(false);
        navigation.navigate(tela);
    };

    const discarEmergencia = () => {
        const numeroEmergencia = '192';
        Alert.alert(
            'Discar Emergência',
            'Deseja discar para o SAMU (192)?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Discar',
                    onPress: () => Linking.openURL(`tel:${numeroEmergencia}`)
                }
            ]
        );
    };

    const handleBotaoPress = (botao) => {
        if (botao.acao === 'emergencia') {
            discarEmergencia();
        } else {
            navegarParaTela(botao.tela);
        }
    };

    const recarregarDica = () => {
        carregarDicaComTentativas();
    };

    return (
        <LinearGradient
            colors={isDarkMode ? ['#1E293B', '#334155'] : ['#6247AA', '#856BCC']}
            style={{ flex: 1 }}
        >
            {/* Navbar */}
            <View style={styles.navbar}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Saúde+</Text>
                </View>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={toggleMenu}
                >
                    <Ionicons
                        name={menuAberto ? "close" : "menu"}
                        size={28}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>

            {/* Menu suspenso */}
            {menuAberto && (
                <View style={styles.menuDropdown}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navegarParaTela('Perfil')}
                    >
                        <Ionicons name="person" size={20} color="#FFFFFF" />
                        <Text style={styles.menuItemText}>Meu Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navegarParaTela('Configuracoes')}
                    >
                        <Ionicons name="settings" size={20} color="#FFFFFF" />
                        <Text style={styles.menuItemText}>Configurações</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navegarParaTela('Historico')}
                    >
                        <Ionicons name="time" size={20} color="#FFFFFF" />
                        <Text style={styles.menuItemText}>Histórico</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Ionicons name="log-out" size={20} color="#FFFFFF" />
                        <Text style={styles.menuItemText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Conteúdo principal */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.titulo}>Sua Saúde</Text>
                        <Text style={styles.subtitle}>Cuide de você hoje!</Text>
                    </View>

                    <View style={styles.gradeContainer}>
                        {botoesGrade.map((botao) => (
                            <TouchableOpacity
                                key={botao.id}
                                style={styles.botaoGrade}
                                onPress={() => handleBotaoPress(botao)}
                            >
                                <LinearGradient
                                    colors={botao.color}
                                    style={styles.botaoGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    {botao.icone}
                                    <Text style={styles.botaoTexto}>{botao.nome}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.metasContainer}>
                        <Text style={styles.metasTitulo}>Metas de Hoje</Text>
                        <View style={styles.metasGrid}>
                            <View style={styles.metaItem}>
                                <View style={[styles.metaIcon, { backgroundColor: '#2563EB' }]}>
                                    <FontAwesome5 name="glass-whiskey" size={20} color="#FFFFFF" />
                                </View>
                                <Text style={styles.metaTexto}>Água</Text>
                                <Text style={styles.metaStatus}>2/8 copos</Text>
                            </View>

                            <View style={styles.metaItem}>
                                <View style={[styles.metaIcon, { backgroundColor: '#059669' }]}>
                                    <MaterialCommunityIcons name="walk" size={20} color="#FFFFFF" />
                                </View>
                                <Text style={styles.metaTexto}>Passos</Text>
                                <Text style={styles.metaStatus}>1.2k/5k</Text>
                            </View>

                            <View style={styles.metaItem}>
                                <View style={[styles.metaIcon, { backgroundColor: '#7C3AED' }]}>
                                    <MaterialCommunityIcons name="meditation" size={20} color="#FFFFFF" />
                                </View>
                                <Text style={styles.metaTexto}>Meditação</Text>
                                <Text style={styles.metaStatus}>0/10 min</Text>
                            </View>

                            <View style={styles.metaItem}>
                                <View style={[styles.metaIcon, { backgroundColor: '#D97706' }]}>
                                    <MaterialCommunityIcons name="food-apple" size={20} color="#FFFFFF" />
                                </View>
                                <Text style={styles.metaTexto}>Frutas</Text>
                                <Text style={styles.metaStatus}>1/3 porções</Text>
                            </View>
                        </View>
                    </View>

                    {/* Dica do dia */}
                    <View style={styles.dicaContainer}>
                        <View style={styles.dicaHeader}>
                            <Ionicons name="bulb" size={24} color="#F59E0B" />
                            <Text style={styles.dicaTitulo}>Dica do Dia</Text>
                        </View>
                        <Text style={styles.dicaTexto}>
                            {carregando ? 'Carregando...' : dicaDoDia}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}