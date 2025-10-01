import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTheme } from '../../../themeContext';
import { useAudio } from '../../../audioContext';
import getStyles from './style';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Meditacao({ navigation }) {
    const { playSomBot, pauseBackgroundMusic, resumeBackgroundMusic, startBackgroundMusic, stopBackgroundMusic } = useAudio();
    const { isDarkMode } = useTheme();
    const styles = getStyles(isDarkMode);

    const [currentSound, setCurrentSound] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentMusicIndex, setCurrentMusicIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Inicia a música de fundo quando a tela carrega
    useEffect(() => {
        startBackgroundMusic();
        
        // Limpa ao sair da tela
        return () => {
            stopBackgroundMusic(); // ⭐ ADICIONE ESTA LINHA
            if (currentSound) {
                currentSound.unloadAsync();
            }
        };
    }, []);

    const playMusic = async (music, index) => {
        try {
            if (currentSound) {
                await currentSound.unloadAsync();
                setCurrentSound(null);
            }

            // Pausa a música de fundo
            await pauseBackgroundMusic();

            // Carrega e toca a música real
            const { sound } = await Audio.Sound.createAsync(
                music.song,
                {
                    shouldPlay: true,
                    volume: music.volume || 1
                }
            );

            setCurrentSound(sound);
            setIsPlaying(true);
            setCurrentMusicIndex(index);

            // Configura o callback quando a música terminar
            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.didJustFinish) {
                    await sound.unloadAsync();
                    setCurrentSound(null);
                    setIsPlaying(false);
                    setCurrentMusicIndex(null);
                    await resumeBackgroundMusic();
                }
            });

        } catch (e) {
            console.error('Erro ao reproduzir música:', e);
            setIsPlaying(false);
            setCurrentMusicIndex(null);
            await resumeBackgroundMusic();
        }
    };

    const stopMusic = async () => {
        try {
            if (currentSound) {
                await currentSound.stopAsync();
                await currentSound.unloadAsync();
                setCurrentSound(null);
            }
            setIsPlaying(false);
            setCurrentMusicIndex(null);
            await resumeBackgroundMusic();
        } catch (e) {
            console.error('Erro ao parar música:', e);
        }
    };

    const openMusicModal = (index) => {
        playSomBot();
        setCurrentMessage(musicPlay[index].msg);
        setModalVisible(true);

        setTimeout(() => {
            playMusic(musicPlay[index], index);
        }, 100);
    };

    const closeModal = () => {
        setModalVisible(false);
        stopMusic();
    };

    const handleBackPress = () => {
        playSomBot();
        stopMusic();
        setTimeout(() => {
            navigation.navigate('Home');
        }, 500);
    };

    const musicPlay = [
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Respire fundo... sinta o ar preenchendo seus pulmões e deixe que toda a tensão se dissolva lentamente.',
            volume: 1,
            name: 'Relaxamento Profundo'
        },
        {
            song: require('../../../assets/music/meditate1.mp3'),
            msg: 'Cada inspiração acalma a mente, cada expiração libera o que não é mais necessário.',
            volume: 1,
            name: 'Respiração Consciente'
        },
        {
            song: require('../../../assets/music/meditate2.mp3'),
            msg: 'Permita-se estar presente neste momento. Nada além do agora importa.',
            volume: 1,
            name: 'Momento Presente'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Sinta a leveza no corpo e a paz na mente. Você está exatamente onde precisa estar.',
            volume: 1,
            name: 'Paz Interior'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Deixe que cada som envolva você como uma onda tranquila, trazendo serenidade ao seu coração.',
            volume: 1,
            name: 'Ondas de Serenidade'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Imagine uma luz suave te envolvendo, preenchendo todo o seu ser com calma e equilíbrio.',
            volume: 1,
            name: 'Luz da Calma'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Liberte-se das preocupações. Aqui e agora, só existe paz.',
            volume: 1,
            name: 'Libertação'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Você é parte da natureza, e a natureza está em você. Sinta essa conexão profunda.',
            volume: 1,
            name: 'Conexão Natural'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Permita que seu corpo relaxe completamente, da cabeça aos pés. Cada músculo solta, cada pensamento desacelera.',
            volume: 1,
            name: 'Relaxamento Total'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'Neste silêncio, você encontra clareza. Nesta pausa, você encontra força.',
            volume: 1,
            name: 'Silêncio Interior'
        },
        {
            song: require('../../../assets/music/Relaxing.mp3'),
            msg: 'A gratidão preenche seu coração e transforma cada instante em um presente.',
            volume: 1,
            name: 'Gratidão'
        }
    ];

    return (
        <LinearGradient
            colors={isDarkMode ? ['#1E293B', '#334155'] : ['#6247AA', '#856BCC']}
            style={{ flex: 1 }}
        >
            {/* Header com botão de voltar */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.titulo}>Músicas para Meditação</Text>
                <Text style={styles.subtitle}>Toque em qualquer música para começar</Text>
            </View>

            {/* Conteúdo principal */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Seção de Músicas */}
                    <View style={styles.musicSection}>
                        <View style={styles.musicGrid}>
                            {musicPlay.map((music, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.musicButton,
                                        currentMusicIndex === index && styles.musicButtonActive
                                    ]}
                                    onPress={() => openMusicModal(index)}
                                >
                                    <LinearGradient
                                        colors={isDarkMode ? ['#4F46E5', '#7C73E6'] : ['#FF6B6B', '#FF8E8E']}
                                        style={styles.musicButtonGradient}
                                    >
                                        <MaterialIcons
                                            name={currentMusicIndex === index && isPlaying ? "pause" : "play-arrow"}
                                            size={24}
                                            color="white"
                                        />
                                        <View style={styles.musicTextContainer}>
                                            <Text style={styles.musicButtonText}>
                                                {music.name}
                                            </Text>
                                            <Text style={styles.musicButtonSubtext}>
                                                {currentMusicIndex === index && isPlaying ? 'Tocando...' : 'Clique para ouvir'}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modal da Música */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <LinearGradient
                            colors={isDarkMode ? ['#4F46E5', '#7C73E6'] : ['#FF6B6B', '#FF8E8E']}
                            style={styles.modalGradient}
                        >
                            <MaterialIcons
                                name={isPlaying ? "music-note" : "schedule"}
                                size={50}
                                color="white"
                            />
                            <Text style={styles.modalTitle}>
                                {isPlaying ? 'Tocando Agora' : 'Música Especial'}
                            </Text>
                            <Text style={styles.modalMessage}>{currentMessage}</Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.modalButton,
                                        !isPlaying && styles.modalButtonDisabled
                                    ]}
                                    onPress={stopMusic}
                                    disabled={!isPlaying}
                                >
                                    <MaterialIcons name="stop" size={20} color="white" />
                                    <Text style={styles.modalButtonText}>Parar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={closeModal}
                                >
                                    <MaterialIcons name="close" size={20} color="white" />
                                    <Text style={styles.modalButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}