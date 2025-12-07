import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useFonts, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { useRouter } from 'expo-router';
import { useAuth } from '@contexts';
import { colors, textPresets } from '@theme';
import { CustomInput, CustomButton } from '@components';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const LOGO_SIZE_LARGE = 130;
const LOGO_SIZE_SMALL = 80;

// Schema de validare
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email cannot be empty')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password cannot be empty'),
});

const LoginScreen = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [logoIsSmall, setLogoIsSmall] = useState(false);
  const [fontsLoaded] = useFonts({ Baloo2_700Bold });

  // React Hook Form
  const { 
    control, 
    handleSubmit, 
    setError, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Keyboard listeners pentru animația logo-ului
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow', 
      () => setLogoIsSmall(true)
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide', 
      () => setLogoIsSmall(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Submit handler
  const onSubmit = useCallback(async (data) => {
    try {
      await login(data.email, data.password);
      router.replace('/(tabs)');
    } catch (error) {
      setError('password', { 
        type: 'manual', 
        message: error.message || 'Incorrect email or password' 
      });
    }
  }, [login, router, setError]);

  // Dismiss keyboard handler
  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // Logo style memoizat
  const logoStyle = useMemo(() => ([
    styles.logo,
    {
      width: logoIsSmall ? LOGO_SIZE_SMALL : LOGO_SIZE_LARGE,
      height: logoIsSmall ? LOGO_SIZE_SMALL : LOGO_SIZE_LARGE,
    }
  ]), [logoIsSmall]);

  // Loading state pentru fonturi
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.text.accentBlue} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity 
            style={styles.logoContainer} 
            onPress={handleDismissKeyboard}
            activeOpacity={0.8}
          >
            <Image
              source={require('@assets/logo.png')}
              style={logoStyle}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Planity</Text>
          <Text style={styles.slogan}>Plan your projects with ease</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Email"
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                editable={!isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
                secureTextEntry
                error={errors.password?.message}
                isPassword
                autoComplete="password"
                textContentType="password"
                editable={!isSubmitting}
              />
            )}
          />

          <CustomButton 
            title={isSubmitting ? "Logging in..." : "Login"} 
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    resizeMode: 'contain',
  },
  title: {
    ...textPresets.title,
    color: colors.text.accentBlue,
    marginTop: 10,
  },
  slogan: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
});

export default LoginScreen;