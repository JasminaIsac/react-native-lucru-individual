import React from 'react';
import { 
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { colors, textPresets } from '@theme';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  isLoading = false,
  disabled = false,
  type = 'primary' // primary, secondary, outline
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      return [
        styles.button,
        styles[`${type}Button`],
        styles.disabledButton,
        style
      ];
    }
    return [styles.button, styles[`${type}Button`], style];
  };

  const getTextStyle = () => {
    if (disabled) {
      return [textPresets.button, styles[`${type}Text`], styles.disabledText, textStyle];
    }
    return [textPresets.button, styles[`${type}Text`], textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={type === 'primary' ? '#fff' : '#007AFF'} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButton: {
    backgroundColor: colors.button.primary,
  },
  secondaryButton: {
    backgroundColor: colors.button.secondary,
  },
  deleteButton: {
    backgroundColor: colors.button.delete,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
      },
      android: {
        elevation: 0,
      },
    }),
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.darkBlue,
  },
  deleteText: {
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: colors.button.disabled,
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
      },
      android: {
        elevation: 0,
      },
    }),
  },
  disabledText: {
    color: '#A0A0A0',
  },
});

export default CustomButton; 