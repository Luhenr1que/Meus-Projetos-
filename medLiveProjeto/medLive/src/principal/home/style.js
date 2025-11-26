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
        // Navbar
        navbar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 50,
            paddingBottom: 15,
            backgroundColor: 'transparent',
        },
        logoContainer: {
            padding: 10,
        },
        logoText: {
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 'bold',
        },
        navbarRight: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        menuButton: {
            padding: 10,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 10,
        },

        // Foto de perfil
        fotoPerfilPequena: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 15,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: '#FFFFFF',
        },
        fotoPerfilImagem: {
            width: '100%',
            height: '100%',
        },
        fotoPerfilPlaceholder: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 15,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#FFFFFF',
        },

        // Menu suspenso
        menuDropdown: {
            position: 'absolute',
            top: 110,
            right: 20,
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            borderRadius: 15,
            padding: 10,
            zIndex: 1000,
            minWidth: 200,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
        },
        menuHeader: {
            alignItems: 'center',
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.1)',
            marginBottom: 10,
        },
        fotoPerfilMenu: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 10,
        },
        fotoPerfilMenuPlaceholder: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
        },
        menuNome: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        menuEmail: {
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderRadius: 10,
            marginBottom: 5,
        },
        menuItemText: {
            color: '#FFFFFF',
            fontSize: 16,
            marginLeft: 12,
            fontWeight: '600',
        },

        // Conteúdo principal
        scrollContent: {
            flexGrow: 1,
            paddingBottom: 20,
        },
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 40,
            marginTop: 10,
        },
        header: {
            alignItems: 'center',
            marginBottom: 30,
        },
        titulo: {
            fontSize: 32,
            fontWeight: '800',
            color: textColor,
            textAlign: 'center',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 18,
            color: secondaryTextColor,
            textAlign: 'center',
            fontWeight: '500',
        },

        // Grade de botões
        gradeContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 30,
        },
        botaoGrade: {
            width: '48%',
            height: 120,
            marginBottom: 15,
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
        },
        botaoGradient: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
        },
        botaoTexto: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '700',
            textAlign: 'center',
            marginTop: 8,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
        },

        // Dica do dia
        dicaContainer: {
            backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            padding: 20,
            borderRadius: 20,
            borderLeftWidth: 4,
            borderLeftColor: '#F59E0B',
        },
        dicaHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        dicaTitulo: {
            fontSize: 18,
            fontWeight: '700',
            color: textColor,
            marginLeft: 8,
        },
        dicaTexto: {
            fontSize: 14,
            color: textColor,
            lineHeight: 20,
            fontWeight: '500',
        },

        // Modal de perfil
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        modalContainer: {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderRadius: 16,
            width: '100%',
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB',
        },
        modalFotoContainer: {
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
        },
        modalFotoPerfil: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 15,
        },
        modalFotoPlaceholder: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        modalTitulo: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDarkMode ? '#FFFFFF' : '#1F2937',
        },
        modalFechar: {
            padding: 4,
        },
        modalContent: {
            padding: 20,
            maxHeight: 400,
        },

        // Informações da foto no modal
        fotoInfoContainer: {
            backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            alignItems: 'center',
        },
        fotoInfoText: {
            color: isDarkMode ? '#D1D5DB' : '#6B7280',
            fontSize: 14,
            textAlign: 'center',
            fontWeight: '500',
        },

        // Campos do formulário
        campoContainer: {
            marginBottom: 16,
        },
        campoLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: isDarkMode ? '#D1D5DB' : '#374151',
            marginBottom: 6,
        },
        campoInput: {
            backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
            borderWidth: 1,
            borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: isDarkMode ? '#FFFFFF' : '#1F2937',
        },

        // Footer do modal
        modalFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? '#334155' : '#E5E7EB',
            gap: 12,
        },
        botaoCancelar: {
            flex: 1,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
            alignItems: 'center',
        },
        botaoCancelarTexto: {
            fontSize: 16,
            fontWeight: '600',
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
        botaoSalvar: {
            flex: 2,
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#6247AA',
            alignItems: 'center',
        },
        botaoDesabilitado: {
            opacity: 0.6,
        },
        botaoSalvarTexto: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
        },

        // Loading
        carregandoContainer: {
            padding: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        carregandoTexto: {
            marginTop: 12,
            fontSize: 16,
            color: isDarkMode ? '#D1D5DB' : '#6B7280',
            textAlign: 'center',
        },
    });
}