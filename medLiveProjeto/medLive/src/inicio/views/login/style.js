import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function getStyles(isDarkMode) {
  const backgroundColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const cardBackground = isDarkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = isDarkMode ? "#FFFFFF" : "#131F3C";
  const secondaryTextColor = isDarkMode ? "#CCCCCC" : "#666666";
  const borderColor = isDarkMode ? "#444" : "#E0E0E0";

  return StyleSheet.create({
    container: {
      width: '100%',
      height: height * 0.85,
      backgroundColor: cardBackground,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 24,
      paddingTop: 40,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },

    header: {
      alignItems: 'center',
      marginBottom: 40,
    },

    logo: {
      width: width * 0.5,
      height: width * 0.5 * 0.4,
      marginBottom: 20,
    },

    title: {
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
    },

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

    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: borderColor,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 56,
      backgroundColor: isDarkMode ? '#333' : '#F8F8F8',
    },

    inputFocused: {
      borderColor: '#6247AA',
      shadowColor: '#6247AA',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },

    inputValid: {
      borderColor: '#4CAF50',
    },

    inputIcon: {
      marginRight: 12,
    },

    textInput: {
      flex: 1,
      fontSize: 16,
      color: textColor,
      paddingVertical: 8,
    },

    senhaInput: {
      flex: 1,
      fontSize: 16,
      color: textColor,
      paddingVertical: 8,
    },

    eyeButton: {
      padding: 4,
    },

    passwordHint: {
      fontSize: 12,
      color: secondaryTextColor,
      marginTop: 4,
      marginLeft: 4,
    },

    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 32,
    },

    forgotPasswordText: {
      color: '#6247AA',
      fontSize: 14,
      fontWeight: '600',
    },

    loginButton: {
      width: '100%',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
      shadowColor: '#6247AA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },

    gradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
    },

    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      marginRight: 8,
    },

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
      color: secondaryTextColor,
      paddingHorizontal: 16,
      fontSize: 14,
    },

    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    signupText: {
      color: secondaryTextColor,
      fontSize: 16,
    },

    signupLink: {
      color: '#6247AA',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });
}