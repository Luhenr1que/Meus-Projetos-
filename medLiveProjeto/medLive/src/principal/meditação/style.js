import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function getStyles(isDarkMode) {
    const textColor = isDarkMode ? "#FFFFFF" : "#131F3C";
    const secondaryTextColor = isDarkMode ? "#CCCCCC" : "#666666";

    return StyleSheet.create({
        scrollContent: {
            flexGrow: 1,
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
            marginBottom: 20,
            paddingTop: 50,
        },
        backButton: {
            position: 'absolute',
            top: 10,
            left: 20,
            zIndex: 10,
            padding: 10,
        },
        titulo: {
            fontSize: 28,
            fontWeight: '800',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 0,
        },
        subtitle: {
            fontSize: 16,
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: '500',
            opacity: 0.9,
        },
        musicSection: {
            marginTop: 10,
        },
        musicGrid: {
            flexDirection: 'column',
        },
        musicButton: {
            width: '100%',
            marginBottom: 12,
            borderRadius: 15,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        musicButtonActive: {
            opacity: 0.8,
            transform: [{ scale: 0.98 }],
        },
        musicButtonGradient: {
            padding: 20,
            alignItems: 'center',
            borderRadius: 15,
            flexDirection: 'row',
        },
        musicButtonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: 15,
            flex: 1,
        },
        musicButtonSubtext: {
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            marginLeft: 15,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            width: '85%',
            borderRadius: 25,
            overflow: 'hidden',
        },
        modalGradient: {
            padding: 30,
            alignItems: 'center',
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 15,
            marginTop: 10,
            textAlign: 'center',
        },
        modalMessage: {
            fontSize: 16,
            color: 'white',
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 20,
        },
        infoBox: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 15,
            borderRadius: 12,
            marginBottom: 20,
            width: '100%',
            alignItems: 'center',
        },
        infoText: {
            color: 'white',
            fontWeight: '600',
            fontSize: 14,
            textAlign: 'center',
        },
        infoSubtext: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 5,
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        modalButton: {
            backgroundColor: 'rgba(255,255,255,0.3)',
            paddingHorizontal: 25,
            paddingVertical: 12,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 0.48,
            justifyContent: 'center',
        },
        modalButtonText: {
            color: 'white',
            fontWeight: 'bold',
            marginLeft: 8,
        },
    });
}