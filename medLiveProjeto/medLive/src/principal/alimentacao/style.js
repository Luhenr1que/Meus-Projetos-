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
        },

        titulo: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
        },

        placeholder: {
            width: 40,
        },

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
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderRadius: 12,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        },

        searchIcon: {
            marginRight: 10,
        },

        searchInput: {
            flex: 1,
            paddingVertical: 12,
            fontSize: 16,
            color: isDarkMode ? '#FFFFFF' : '#1F2937',
        },

        clearButton: {
            padding: 4,
        },

        searchButton: {
            backgroundColor: isDarkMode ? '#059669' : '#047857',
            padding: 12,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 50,
        },

        content: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
        },

        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 15,
        },

        loadingText: {
            fontSize: 16,
            color: isDarkMode ? '#D1D5DB' : '#6B7280',
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
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
        },

        emptySubtext: {
            fontSize: 14,
            color: isDarkMode ? '#6B7280' : '#9CA3AF',
            textAlign: 'center',
            lineHeight: 20,
        },

        listContainer: {
            paddingBottom: 20,
        },

        resultadosText: {
            fontSize: 14,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginBottom: 15,
            textAlign: 'center',
        },

        cardAlimento: {
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            borderWidth: 1,
            borderColor: isDarkMode ? '#4B5563' : '#F3F4F6',
        },

        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },

        imagemAlimento: {
            width: 60,
            height: 60,
            borderRadius: 8,
            marginRight: 12,
        },

        imagemPlaceholder: {
            width: 60,
            height: 60,
            borderRadius: 8,
            backgroundColor: isDarkMode ? '#4B5563' : '#F3F4F6',
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
            color: isDarkMode ? '#F9FAFB' : '#1F2937',
            marginBottom: 4,
        },

        marcaAlimento: {
            fontSize: 14,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            fontStyle: 'italic',
        },

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
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginBottom: 4,
            textAlign: 'center',
        },

        nutrienteValue: {
            fontSize: 14,
            fontWeight: '600',
            color: isDarkMode ? '#FFFFFF' : '#1F2937',
            textAlign: 'center',
        },

        cardFooter: {
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            paddingTop: 12,
        },

        infoPorcao: {
            fontSize: 12,
            color: isDarkMode ? '#6B7280' : '#9CA3AF',
            textAlign: 'center',
            fontStyle: 'italic',
        },

        dicaContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            marginTop: 20,
            borderWidth: 1,
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        },

        dicaText: {
            flex: 1,
            fontSize: 14,
            color: isDarkMode ? '#D1D5DB' : '#6B7280',
            marginLeft: 12,
            lineHeight: 20,
        },
    });
}