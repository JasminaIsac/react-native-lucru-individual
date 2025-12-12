import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Keyboard, Image, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { CustomInput, CustomButton } from '@components/index';
import { useAuth } from '@contexts/AuthContext';
import { colors, textPresets } from '@theme/index';

const LOGO_SIZE_LARGE = 130;
const LOGO_SIZE_SMALL = 80;

// Definim schema Zod pentru validarea formularului
const loginSchema = z.object({
  email: z.string().min(1, "Email cannot be empty").email("Invalid email format"),
  password: z.string().min(1, "Password cannot be empty"),
});

const LoginScreen = () => {
  const { login } = useAuth();
  const [logoIsSmall, setLogoIsSmall] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => setLogoIsSmall(true));
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => setLogoIsSmall(false));
    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await login(data.email, data.password);
      
      console.log('Login response:', response);

      if (success) {
        router.replace("/(tabs)");
      } else {
        setError('password', { type: 'manual', message: 'Incorrect email or password' });
      }

    } catch (err) {
      setError('password', {
        type: 'manual',
        message: 'Incorrect email or password',
      });
      setServerError(err);
    }
  };

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
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.logoContainer} onPress={Keyboard.dismiss}>
            <Image
              source={require('@assets/logo.png')}
              style={[
                styles.logo,
                {
                  width: logoIsSmall ? LOGO_SIZE_SMALL : LOGO_SIZE_LARGE,
                  height: logoIsSmall ? LOGO_SIZE_SMALL : LOGO_SIZE_LARGE,
                },
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Planity</Text>
          <Text style={styles.slogan}>Plan your projects with ease</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            name="email"
            control={control}
            label={"Email"}
            placeholder="Email"
            secureTextEntry={false}
            keyboardType="email-address"
            autoCapitalize="none"
            otherstyles={{ borderColor: errors.password ? colors.border.error : colors.border.primary }}
            error={errors.email?.message}
          />
          <CustomInput
            name="password"
            control={control}
            label={"Password"}
            placeholder="Password"
            secureTextEntry={true}
            error={errors.password?.message}
            isPassword={true}
            otherstyles={{ borderColor: errors.password ? colors.border.error : colors.border.primary }}
          />

          <CustomButton title="Login" onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
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
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  serverError: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
