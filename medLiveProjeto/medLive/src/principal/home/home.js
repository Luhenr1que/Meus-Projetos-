import React, { useState, useEffect } from 'react';
import { 
    View, 
    ScrollView, 
    Text, 
    Image, 
    Dimensions, 
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useTheme } from '../../../themeContext';
import getStyles from './style';
import { Ionicons, MaterialCommunityIcons, FontAwesome6, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useApi, STORAGE_URL } from '../../../crud'; // Importe STORAGE_URL

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
    const { isDarkMode } = useTheme();
    const styles = getStyles(isDarkMode);
    const [menuAberto, setMenuAberto] = useState(false);
    const [dicaDoDia, setDicaDoDia] = useState('Carregando dica do dia...');
    const [carregando, setCarregando] = useState(true);
    const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
    const [carregandoPerfil, setCarregandoPerfil] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [fotoPerfil, setFotoPerfil] = useState(null); // Estado para a foto
    const [dadosCompletos, setDadosCompletos] = useState(null); // Estado para dados completos

    const { logoutPaciente, getPaciente, updatePaciente, getUserData } = useApi();

    // Estado para os dados do perfil
    const [dadosPerfil, setDadosPerfil] = useState({
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        endereco: '',
        cidade: '',
        estado: ''
    });

    // Carregar foto do perfil
    const carregarFotoPerfil = async () => {
        try {
            const userData = await getUserData();
            if (userData && userData.fotoPerfil) {
                const fotoUrl = `${STORAGE_URL}/${userData.fotoPerfil}`;
                console.log('📸 Carregando foto:', fotoUrl);
                setFotoPerfil(fotoUrl);
            } else {
                setFotoPerfil(null);
            }
        } catch (error) {
            console.log('Erro ao carregar foto:', error);
            setFotoPerfil(null);
        }
    };

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
                console.log('Frases válidas:', frasesValidas);
                
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

    // Carregar dados do perfil
    const carregarPerfil = async () => {
        try {
            setCarregandoPerfil(true);
            const paciente = await getPaciente();
            
            if (paciente) {
                console.log('Dados do paciente carregados:', paciente);
                setDadosCompletos(paciente); // Salva dados completos
                setDadosPerfil({
                    nome: paciente.nomePaciente || '',
                    email: paciente.emailPaciente || '',
                    telefone: paciente.telefonePaciente || '',
                    dataNascimento: paciente.dataNascimento || '',
                    endereco: paciente.logradouro || '',
                    cidade: paciente.cidade || '',
                    estado: paciente.estado || ''
                });

                // Carrega a foto se existir
                if (paciente.fotoPerfil) {
                    const fotoUrl = `${STORAGE_URL}/${paciente.fotoPerfil}`;
                    console.log('📸 Foto do perfil:', fotoUrl);
                    setFotoPerfil(fotoUrl);
                } else {
                    setFotoPerfil(null);
                }
            }
        } catch (error) {
            console.log('Erro ao carregar perfil:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        } finally {
            setCarregandoPerfil(false);
        }
    };

    // Salvar dados do perfil
    const salvarPerfil = async () => {
        try {
            setSalvando(true);
            
            // Validação básica
            if (!dadosPerfil.nome.trim()) {
                Alert.alert('Atenção', 'Por favor, informe seu nome.');
                return;
            }

            if (!dadosPerfil.email.trim()) {
                Alert.alert('Atenção', 'Por favor, informe seu email.');
                return;
            }

            const resultado = await updatePaciente(dadosPerfil);
            
            if (resultado) {
                // Recarrega a foto após salvar
                await carregarFotoPerfil();
                setModalPerfilVisivel(false);
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            }
            
        } catch (error) {
            console.log('Erro ao salvar perfil:', error);
            // O alerta de erro já é mostrado na função updatePaciente
        } finally {
            setSalvando(false);
        }
    };

    // Abrir modal de perfil
    const abrirModalPerfil = () => {
        setModalPerfilVisivel(true);
        carregarPerfil();
    };

    // Fechar modal
    const fecharModalPerfil = () => {
        setModalPerfilVisivel(false);
        // Resetar dados quando fechar
        setDadosPerfil({
            nome: '',
            email: '',
            telefone: '',
            dataNascimento: '',
            endereco: '',
            cidade: '',
            estado: ''
        });
    };

    // Efeito para carregar a foto quando o componente montar
    useEffect(() => {
        carregarTodasFrases();
        carregarFotoPerfil(); // Carrega a foto ao iniciar
        
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
            nome: 'Mercados Próximos',
            color: ['#15803d', '#22c55e'],
            icone: <MaterialCommunityIcons name='store-marker' size={45} color="#FFFFFF" />,
            tela: 'MapaMercados'
        },
        {
            id: 10,
            nome: 'Emergência',
            color: ['#DC2626', '#EF4444'],
            icone: <Ionicons name='alert-circle' size={45} color="#FFFFFF" />,
            acao: 'emergencia'
        },
        {
            id: 11,
            nome: 'Meu Perfil',
            color: ['#C026D3', '#D946EF'],
            icone: <Ionicons name='person' size={45} color="#FFFFFF" />,
            acao: 'abrirPerfil'
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
        } else if (botao.acao === 'abrirPerfil') {
            abrirModalPerfil();
        } else {
            navegarParaTela(botao.tela);
        }
    };

    return (
        <LinearGradient
            colors={isDarkMode ? ['#1E293B', '#334155'] : ['#6247AA', '#856BCC']}
            style={{ flex: 1 }}
        >
            {/* Navbar com foto de perfil */}
            <View style={styles.navbar}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Saúde+</Text>
                </View>

                <View style={styles.navbarRight}>
                    {/* Foto de perfil pequena */}
                    {fotoPerfil ? (
                        <TouchableOpacity 
                            style={styles.fotoPerfilPequena}
                            onPress={abrirModalPerfil}
                        >
                            <Image 
                                source={{ uri: fotoPerfil }} 
                                style={styles.fotoPerfilImagem}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.fotoPerfilPlaceholder}
                            onPress={abrirModalPerfil}
                        >
                            <Ionicons name="person" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}

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
            </View>

            {/* Menu suspenso */}
            {menuAberto && (
                <View style={styles.menuDropdown}>
                    <View style={styles.menuHeader}>
                        {fotoPerfil ? (
                            <Image 
                                source={{ uri: fotoPerfil }} 
                                style={styles.fotoPerfilMenu}
                            />
                        ) : (
                            <View style={styles.fotoPerfilMenuPlaceholder}>
                                <Ionicons name="person" size={30} color="#FFFFFF" />
                            </View>
                        )}
                        <Text style={styles.menuNome}>
                            {dadosPerfil.nome || 'Usuário'}
                        </Text>
                        <Text style={styles.menuEmail}>
                            {dadosPerfil.email || ''}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => abrirModalPerfil()}
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
                        onPress={() => {logoutPaciente(), navigation.replace('Login');}}
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

                    {/* Dica do dia */}
                    <View style={styles.dicaContainer}>
                        <View style={styles.dicaHeader}>
                            <Ionicons name="bulb" size={24} color="#F59E0B" />
                            <Text style={styles.dicaTitulo}>Frase do Dia</Text>
                        </View>
                        <Text style={styles.dicaTexto}>
                            {carregando ? 'Carregando...' : dicaDoDia}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Modal de Perfil - ATUALIZADO para mostrar foto */}
            <Modal
                visible={modalPerfilVisivel}
                animationType="slide"
                transparent={true}
                onRequestClose={fecharModalPerfil}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Header do Modal com Foto */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalFotoContainer}>
                                {fotoPerfil ? (
                                    <Image 
                                        source={{ uri: fotoPerfil }} 
                                        style={styles.modalFotoPerfil}
                                    />
                                ) : (
                                    <View style={styles.modalFotoPlaceholder}>
                                        <Ionicons name="person" size={40} color="#6247AA" />
                                    </View>
                                )}
                                <Text style={styles.modalTitulo}>Meu Perfil</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.modalFechar}
                                onPress={fecharModalPerfil}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Conteúdo do Modal */}
                        <ScrollView style={styles.modalContent}>
                            {carregandoPerfil ? (
                                <View style={styles.carregandoContainer}>
                                    <ActivityIndicator size="large" color="#6247AA" />
                                    <Text style={styles.carregandoTexto}>Carregando perfil...</Text>
                                </View>
                            ) : (
                                <>
                                    {/* Informações da Foto */}
                                    <View style={styles.fotoInfoContainer}>
                                        <Text style={styles.fotoInfoText}>
                                            {fotoPerfil 
                                                ? 'Foto de perfil carregada' 
                                                : 'Nenhuma foto de perfil'
                                            }
                                        </Text>
                                    </View>

                                    {/* Campo Nome */}
                                    <View style={styles.campoContainer}>
                                        <Text style={styles.campoLabel}>Nome Completo</Text>
                                        <TextInput
                                            style={styles.campoInput}
                                            value={dadosPerfil.nome}
                                            onChangeText={(text) => setDadosPerfil({...dadosPerfil, nome: text})}
                                            placeholder="Digite seu nome"
                                            placeholderTextColor="#999"
                                        />
                                    </View>

                                    {/* ... outros campos mantidos iguais ... */}
                                    <View style={styles.campoContainer}>
                                        <Text style={styles.campoLabel}>Email</Text>
                                        <TextInput
                                            style={styles.campoInput}
                                            value={dadosPerfil.email}
                                            onChangeText={(text) => setDadosPerfil({...dadosPerfil, email: text})}
                                            placeholder="Digite seu email"
                                            placeholderTextColor="#999"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>

                                    <View style={styles.campoContainer}>
                                        <Text style={styles.campoLabel}>Telefone</Text>
                                        <TextInput
                                            style={styles.campoInput}
                                            value={dadosPerfil.telefone}
                                            onChangeText={(text) => setDadosPerfil({...dadosPerfil, telefone: text})}
                                            placeholder="(00) 00000-0000"
                                            placeholderTextColor="#999"
                                            keyboardType="phone-pad"
                                        />
                                    </View>

                                    <View style={styles.campoContainer}>
                                        <Text style={styles.campoLabel}>Endereço</Text>
                                        <TextInput
                                            style={styles.campoInput}
                                            value={dadosPerfil.endereco}
                                            onChangeText={(text) => setDadosPerfil({...dadosPerfil, endereco: text})}
                                            placeholder="Rua, número, bairro"
                                            placeholderTextColor="#999"
                                        />
                                    </View>

                                    <View style={styles.campoContainer}>
                                        <Text style={styles.campoLabel}>Cidade</Text>
                                        <TextInput
                                            style={styles.campoInput}
                                            value={dadosPerfil.cidade}
                                            onChangeText={(text) => setDadosPerfil({...dadosPerfil, cidade: text})}
                                            placeholder="Sua cidade"
                                            placeholderTextColor="#999"
                                        />
                                    </View>

                                    <View style={styles.campoContainer}>
                                        <Text style={styles.campoLabel}>Estado</Text>
                                        <TextInput
                                            style={styles.campoInput}
                                            value={dadosPerfil.estado}
                                            onChangeText={(text) => setDadosPerfil({...dadosPerfil, estado: text})}
                                            placeholder="UF"
                                            placeholderTextColor="#999"
                                            maxLength={2}
                                            autoCapitalize="characters"
                                        />
                                    </View>
                                </>
                            )}
                        </ScrollView>

                        {/* Footer do Modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={styles.botaoCancelar}
                                onPress={fecharModalPerfil}
                                disabled={salvando}
                            >
                                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
                                onPress={salvarPerfil}
                                disabled={salvando}
                            >
                                {salvando ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.botaoSalvarTexto}>Salvar Alterações</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}