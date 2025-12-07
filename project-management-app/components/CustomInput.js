import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textPresets } from '@theme';

const CustomInput = ({ 
    value, 
    label,
    onChangeText, 
    placeholder, 
    secureTextEntry, 
    otherstyles, 
    keyboardType, 
    autoCapitalize,
    multiline,
    error = false,
    isPassword = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);
  
    const shouldHideText = isPassword ? !showPassword : secureTextEntry;

    const togglePassword = () => {
        setShowPassword(prev => !prev);
        setTimeout(() => {
          inputRef.current?.focus();  // aduce tastatura înapoi
        }, 50); // delay mic
      };
      

  return (
    <View style={[styles.container, otherstyles]}>
        {label && <Text style={[textPresets.headerSmall, { color: colors.text.primary, marginBottom: 10 }]}>{label}</Text>}
        <View style={styles.inputWrapper}>
        <TextInput
            ref={inputRef}
            style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            isPassword && { paddingRight: 40 }
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#666"
            secureTextEntry={shouldHideText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline={multiline}
            autoComplete="off"
        />
        {isPassword && (
        <Pressable
          style={styles.eyeIcon}
          onPress={togglePassword}
          onStartShouldSetResponder={() => true}
        >
        <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="gray"
        />
        </Pressable>

        )}
        </View>
        {error && <Text style={[textPresets.bodySmall, { color: colors.text.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 5,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: colors.background.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        fontSize: 16,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.border.primary,
        shadowColor: colors.shadow.primary,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
        marginBottom: 10,
    },
    inputFocused: {
        borderColor: colors.border.focused,
        backgroundColor: colors.background.primary,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    inputError: {
        borderColor: colors.border.error,
        backgroundColor: colors.background.error,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
});

export default CustomInput;
