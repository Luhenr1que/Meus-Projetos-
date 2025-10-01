import { createContext, useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';

// Cria o contexto
const AudioContext = createContext();

// Hook customizado para usar o contexto
export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Função para inicializar o áudio (chamar após primeira interação do usuário)
  const initializeAudio = async () => {
    try {
      if (sound || !userInteracted) return;

      const { sound: newSound } = await Audio.Sound.createAsync(
        require('./assets/music/back.mp3'),
        { shouldPlay: true, isLooping: true }
      );

      await newSound.setVolumeAsync(0.2);
      setSound(newSound);
      setIsAudioReady(true);
    } catch (e) {
      console.error('Erro ao inicializar áudio:', e);
    }
  };

  const playBackgroundMusic = async () => {
    try {
      if (!userInteracted) {
        setUserInteracted(true);
        await initializeAudio();
        return;
      }

      if (sound) {
        await sound.playAsync();
      } else {
        await initializeAudio();
      }
    } catch (e) {
      console.error('Erro ao tocar música de fundo:', e);
    }
  };

  const pauseBackgroundMusic = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
      }
    } catch (e) {
      console.error('Erro ao pausar música de fundo:', e);
    }
  };

  const resumeBackgroundMusic = async () => {
    try {
      if (sound) {
        await sound.playAsync();
      }
    } catch (e) {
      console.error('Erro ao retomar música de fundo:', e);
    }
  };

  const playSomBot = async () => {
    try {
      // Marca que o usuário interagiu
      if (!userInteracted) {
        setUserInteracted(true);
      }

      const { sound: som } = await Audio.Sound.createAsync(
        require('./assets/music/botao.mp3')
      );

      await som.setVolumeAsync(0.7);
      await som.playAsync();

      som.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          som.unloadAsync();
        }
      });
    } catch (e) {
      console.error('Erro no som do botão:', e);
    }
  };

  const playSomBotCode = async () => {
    try {
      // Marca que o usuário interagiu
      if (!userInteracted) {
        setUserInteracted(true);
      }

      const { sound: som } = await Audio.Sound.createAsync(
        require('./assets/music/botCode.mp3')
      );

      await som.setVolumeAsync(0.7);
      await som.playAsync();

      som.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          som.unloadAsync();
        }
      });
    } catch (e) {
      console.error('Erro no som do botão (Code):', e);
    }
  };

  // Configuração inicial do áudio
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    setIsAudioReady(true);
  }, []);

  // Inicia a música de fundo quando o usuário interagir
  useEffect(() => {
    if (userInteracted && isAudioReady && !sound) {
      initializeAudio();
    }
  }, [userInteracted, isAudioReady]);

  return (
    <AudioContext.Provider
      value={{
        playBackgroundMusic,
        playSomBot,
        playSomBotCode,
        pauseBackgroundMusic,
        resumeBackgroundMusic,
        userInteracted,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};