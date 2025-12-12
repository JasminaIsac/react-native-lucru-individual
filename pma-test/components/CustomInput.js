import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { colors, textPresets } from '@theme/index';

const CustomInput = ({ 
    name,
    control,
    label,
    placeholder,
    secureTextEntry,
    otherstyles,
    keyboardType,
    autoCapitalize,
    multiline,
    error = "",
    isPassword = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    const shouldHideText = isPassword ? !showPassword : secureTextEntry;

    const togglePassword = () => {
        setShowPassword(prev => !prev);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    return (
        <View style={[styles.container, otherstyles]}>
            {label && (
                <Text style={[textPresets.headerSmall, { color: colors.text.primary, marginBottom: 10 }]}>
                    {label}
                </Text>
            )}

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
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
                            onChangeText={onChange}
                            placeholder={placeholder}
                            placeholderTextColor="#666"
                            secureTextEntry={shouldHideText}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                setIsFocused(false);
                                onBlur();
                            }}
                            multiline={multiline}
                            autoComplete="off"
                        />

                        {isPassword && (
                            <Pressable style={styles.eyeIcon} onPress={togglePassword}>
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={22}
                                    color="gray"
                                />
                            </Pressable>
                        )}
                    </View>
                )}
            />

            {error ? (
                <Text style={[textPresets.bodySmall, { color: colors.text.error }]}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', marginVertical: 5 },
    inputWrapper: { position: 'relative', justifyContent: 'center' },
    input: {
        backgroundColor: colors.background.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        fontSize: 16,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.border.primary,
        marginBottom: 10,
    },
    inputFocused: {
        borderColor: colors.border.focused,
        backgroundColor: colors.background.primary,
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
