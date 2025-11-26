import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function getStyles(isDarkMode) {
  const backgroundColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const cardBackground = isDarkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = isDarkMode ? "#FFFFFF" : "#131F3C";
  const secondaryTextColor = isDarkMode ? "#CCCCCC" : "#666666";
  const borderColor = isDarkMode ? "#444" : "#E0E0E0";
  const primaryColor = '#856bccff';

  return StyleSheet.create({
    // ===== LAYOUT PRINCIPAL CORRIGIDO =====
    container: {
      width: '100%',
      minHeight: height * 0.85, // Alterado para minHeight
      backgroundColor: cardBackground,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 40, // Adicionado padding bottom
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
      marginTop: height * 0.15, // Adiciona espaço no topo
    },

    // ===== HEADER E LOGO =====
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: width * 0.5,
      height: width * 0.5 * 0.4,
      marginBottom: 20,
    },

    // ===== TÍTULOS E TEXTOS =====
    titulo: {
      fontSize: 28,
      fontWeight: '700',
      color: textColor,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: secondaryTextColor,
      textAlign: 'center',
      marginBottom: 40,
    },

    // ===== FORMULÁRIO =====
    formContainer: {
      width: '100%',
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      marginBottom: 8,
    },

    // ===== CAMPOS DE TEXTO =====
    textInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: borderColor,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 56,
      backgroundColor: isDarkMode ? '#333' : '#F8F8F8',
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: textColor,
      paddingVertical: 8,
    },

    // ===== CAMPOS DE SENHA =====
    senhaWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: borderColor,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 56,
      backgroundColor: isDarkMode ? '#333' : '#F8F8F8',
    },
    senhaInput: {
      flex: 1,
      fontSize: 16,
      color: textColor,
      paddingVertical: 8,
    },
    olhoBotao: {
      padding: 4,
    },
    passwordHint: {
      fontSize: 12,
      color: secondaryTextColor,
      marginTop: 4,
      marginLeft: 4,
    },

    // ===== BOTÕES =====
    botoes: {
      width: '100%',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
      shadowColor: primaryColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      marginTop: 40,
    },
    gradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    textBtn: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      marginRight: 8,
    },

    // ===== DIVISOR =====
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: borderColor,
    },
    dividerText: {
      marginHorizontal: 16,
      color: secondaryTextColor,
      fontSize: 14,
    },

    // ===== LINK PARA LOGIN =====
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    signupText: {
      fontSize: 16,
      color: secondaryTextColor,
    },
    signupLink: {
      fontSize: 16,
      marginLeft: 6,
      color: primaryColor,
      fontWeight: '600',
    },

    // ===== ESTADOS DOS INPUTS =====

    inputValid: {
      borderColor: '#4CAF50',
    },

    tipoSanguineoBtn: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#444',
      borderWidth: 2,
      borderColor: '#666'
    },
    tipoSanguineoBtnSelected: {
      backgroundColor: '#6247AA',
      borderColor: '#6247AA'
    },
    tipoSanguineoText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16
    },
    tipoSanguineoTextSelected: {
      color: '#fff'
    },
    selecionadoText: {
      color: '#6247AA',
      fontSize: 14,
      marginTop: 5,
      fontWeight: '500',
      textAlign: 'center'
    },
    fotoContainer: {
      alignItems: 'center',
      marginBottom: 30,
      width: '100%',
    },

    fotoButton: {
      position: 'relative',
      marginBottom: 15,
    },

    fotoSelecionada: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 3,
      borderColor: '#6247AA',
    },

    fotoPlaceholder: {
      width: 150,
      height: 150,
      borderRadius: 75,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: isDarkMode ? '#fff' : '#fff',
      borderStyle: 'dashed',
    },

    editIconContainer: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: '#6247AA',
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },

    fotoPlaceholderSubtext: {
      color: '#fff',
      fontSize: 12,
      marginTop: 8,
      textAlign: 'center',
      fontWeight: '500',
    },

    instrucoesText: {
      color: isDarkMode ? '#ccc' : '#fff',
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '500',
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderRadius: 15,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? '#fff' : '#000',
    },

    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#555' : '#eee',
    },

    modalOptionText: {
      fontSize: 16,
      marginLeft: 10,
      color: isDarkMode ? '#fff' : '#000',
    },

    modalCancel: {
      padding: 15,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },

    modalCancelText: {
      fontSize: 16,
      color: '#6247AA',
      fontWeight: '600',
    },
    // Adicione estas styles ao seu arquivo de estilos
    dadosResumo: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: '#6247AA',
    },
    dadosTitulo: {
      color: isDarkMode ? '#fff' : '#333',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    dadosItem: {
      color: isDarkMode ? '#ccc' : '#666',
      fontSize: 14,
      marginBottom: 5,
    },
    alertContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,165,0,0.2)',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    alertText: {
      color: '#FFA500',
      marginLeft: 10,
      fontSize: 12,
      flex: 1,
    },
    fotoComContainer: {
      position: 'relative',
      alignItems: 'center',
    },

    botaoRemoverFoto: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 2,
    },

    observacao: {
      fontSize: 14,
      color: isDarkMode ? '#CCC' : '#666',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 20,
      fontStyle: 'italic',
    },
  });
}