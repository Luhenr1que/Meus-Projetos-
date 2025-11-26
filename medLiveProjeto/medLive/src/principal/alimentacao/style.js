// style.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function getStyles(isDarkMode) {
    const colors = {
        background: isDarkMode ? '#1F2937' : '#F9FAFB',
        cardBackground: isDarkMode ? '#374151' : '#FFFFFF',
        modalBackground: isDarkMode ? '#374151' : '#FFFFFF',
        textPrimary: isDarkMode ? '#F9FAFB' : '#1F2937',
        textSecondary: isDarkMode ? '#9CA3AF' : '#6B7280',
        textTertiary: isDarkMode ? '#6B7280' : '#9CA3AF',
        border: isDarkMode ? '#4B5563' : '#E5E7EB',
        borderLight: isDarkMode ? '#4B5563' : '#F3F4F6',
        primary: '#059669',
        primaryDark: '#047857',
        warning: '#F59E0B',
        error: '#EF4444',
        white: '#FFFFFF',
        black: '#000000',
    };

    return StyleSheet.create({
        // Container principal
        gradientContainer: {
            flex: 1,
        },

        // Header
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 15,
            paddingTop: 50,
        },
        backButton: {
            padding: 8,
            borderRadius: 8,
        },
        titulo: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.white,
            textAlign: 'center',
        },
        placeholder: {
            width: 40,
        },

        // Barra de pesquisa
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
            gap: 10,
        },
        searchInputContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.modalBackground,
            borderRadius: 12,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: colors.border,
        },
        searchIcon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.textPrimary,
        },
        clearButton: {
            padding: 4,
            borderRadius: 12,
        },
        searchButton: {
            backgroundColor: colors.primaryDark,
            padding: 12,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 50,
        },

        // Avisos e dicas
        warningContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            marginHorizontal: 20,
            borderRadius: 8,
            gap: 8,
        },
        warningText: {
            fontSize: 14,
            color: colors.warning,
            textAlign: 'center',
            flex: 1,
        },
        dicaContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
            padding: 16,
            borderRadius: 12,
            marginTop: 20,
            borderWidth: 1,
            borderColor: colors.border,
        },
        dicaText: {
            flex: 1,
            fontSize: 14,
            color: colors.textSecondary,
            marginLeft: 12,
            lineHeight: 20,
        },

        // Conteúdo principal
        content: {
            flex: 1,
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
        },
        listContainer: {
            paddingBottom: 20,
        },
        keyboardOpenList: {
            paddingBottom: 300,
        },

        // Estados de carregamento e vazio
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 15,
        },
        loadingText: {
            fontSize: 16,
            color: colors.textSecondary,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 15,
            paddingHorizontal: 40,
        },
        emptyText: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textSecondary,
            textAlign: 'center',
        },
        emptySubtext: {
            fontSize: 14,
            color: colors.textTertiary,
            textAlign: 'center',
            lineHeight: 20,
        },

        // Card de receita
        cardAlimento: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: colors.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            borderWidth: 1,
            borderColor: colors.borderLight,
        },
        cardPressed: {
            opacity: 0.8,
            transform: [{ scale: 0.98 }],
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },
        imagemPlaceholder: {
            width: 60,
            height: 60,
            borderRadius: 8,
            backgroundColor: colors.borderLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        infoBasica: {
            flex: 1,
        },
        nomeAlimento: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        marcaAlimento: {
            fontSize: 14,
            color: colors.textSecondary,
            fontStyle: 'italic',
        },
        categoriaAlimento: {
            fontSize: 12,
            color: colors.textTertiary,
            marginTop: 2,
        },

        // Informações nutricionais
        infoNutricional: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 12,
        },
        nutrienteItem: {
            alignItems: 'center',
            minWidth: '22%',
        },
        nutrienteLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            marginBottom: 4,
            textAlign: 'center',
        },
        nutrienteValue: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textPrimary,
            textAlign: 'center',
        },

        // Rodapé do card
        cardFooter: {
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 12,
        },
        infoPorcao: {
            fontSize: 12,
            color: colors.textTertiary,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        resultadosText: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 15,
            textAlign: 'center',
        },

        // Modal
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: colors.modalBackground,
            borderRadius: 20,
            padding: 20,
            margin: 20,
            maxHeight: '80%',
            minWidth: '90%',
            shadowColor: colors.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        modalScrollView: {
            flex: 1,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 15,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            flex: 1,
            marginRight: 10,
        },
        closeButton: {
            padding: 5,
            borderRadius: 15,
            backgroundColor: colors.borderLight,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        closeButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },

        // Imagem da receita no modal
        recipeImagePlaceholder: {
            width: '100%',
            height: 120,
            borderRadius: 12,
            backgroundColor: colors.borderLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
        },
        recipeImageText: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 8,
        },

        // Seções de detalhes
        detailsSection: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
            paddingLeft: 12,
        },

        // Linhas de detalhes
        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        detailLabel: {
            fontSize: 14,
            color: colors.textSecondary,
            flex: 1,
        },
        detailValue: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textPrimary,
            textAlign: 'right',
            flex: 1,
        },

        // Ingredientes
        ingredientItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: 6,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderLight,
        },
        ingredientBullet: {
            fontSize: 16,
            color: colors.primary,
            marginRight: 8,
            marginTop: 2,
        },
        ingredientText: {
            fontSize: 14,
            color: colors.textPrimary,
            flex: 1,
            lineHeight: 20,
        },

        // Instruções
        instructionItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderLight,
        },
        instructionStep: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.primary,
            marginRight: 8,
            minWidth: 20,
        },
        instructionText: {
            fontSize: 14,
            color: colors.textPrimary,
            flex: 1,
            lineHeight: 20,
        },

        // Estados de carregamento e erro
        modalLoading: {
            padding: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalLoadingText: {
            marginTop: 10,
            fontSize: 16,
            color: colors.textPrimary,
            textAlign: 'center',
        },
        errorText: {
            color: colors.error,
            textAlign: 'center',
            marginBottom: 15,
            fontSize: 16,
        },
        noDataText: {
            color: colors.textTertiary,
            fontStyle: 'italic',
            textAlign: 'center',
            marginVertical: 10,
        },

        // Botões
        buttonPressed: {
            opacity: 0.7,
            transform: [{ scale: 0.95 }],
        },
        retryButton: {
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 10,
        },
        retryButtonText: {
            color: colors.white,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
        },

        // Link externo
        externalLinkButton: {
            backgroundColor: colors.borderLight,
            padding: 15,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        externalLinkText: {
            color: colors.textPrimary,
            fontSize: 14,
            fontWeight: '600',
        },

        // Informação da fonte
        dataSourceInfo: {
            backgroundColor: isDarkMode ? 'rgba(5, 150, 105, 0.1)' : 'rgba(5, 150, 105, 0.1)',
            padding: 12,
            borderRadius: 8,
            marginTop: 15,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
        },
        dataSourceText: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        imagemAlimento: {
            width: 60,
            height: 60,
            borderRadius: 8,
            marginRight: 12,
        },

        // Modal image
        modalImage: {
            width: '100%',
            height: 200,
            borderRadius: 12,
            marginBottom: 15,
        },

        // Container de ações
        actionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            gap: 10,
        },
        actionButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            borderRadius: 8,
            gap: 8,
        },
        videoButton: {
            backgroundColor: '#DC2626', // Vermelho para vídeo
        },
        sourceButton: {
            backgroundColor: '#2563EB', // Azul para fonte
        },
        actionButtonText: {
            color: colors.white,
            fontWeight: '600',
            fontSize: 14,
        },
    });
}