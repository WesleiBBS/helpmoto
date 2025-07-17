import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail } from '../../utils/validation';
import { COLORS, DIMENSIONS, USER_TYPES } from '../../constants';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(USER_TYPES.CLIENT);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulação de login - substituir pela chamada real da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de dados do usuário
      const userData = {
        id: '1',
        name: 'Usuário Teste',
        email: email,
        phone: '(11) 99999-9999',
      };

      const token = 'mock_token_123';
      
      await signIn(token, userData, userType);
    } catch (error) {
      Alert.alert(
        'Erro no Login',
        error.message || 'Ocorreu um erro ao fazer login. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>HelpMoto</Text>
            </View>
            <Text style={styles.subtitle}>
              Socorro rápido para motociclistas
            </Text>
          </View>

          {/* Seletor de tipo de usuário */}
          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeLabel}>Entrar como:</Text>
            <View style={styles.userTypeButtons}>
              <Button
                title="Cliente"
                variant={userType === USER_TYPES.CLIENT ? 'primary' : 'outline'}
                size="small"
                style={styles.userTypeButton}
                onPress={() => handleUserTypeChange(USER_TYPES.CLIENT)}
              />
              <Button
                title="Prestador"
                variant={userType === USER_TYPES.PROVIDER ? 'primary' : 'outline'}
                size="small"
                style={styles.userTypeButton}
                onPress={() => handleUserTypeChange(USER_TYPES.PROVIDER)}
              />
            </View>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            <Button
              title="Esqueci minha senha"
              variant="ghost"
              size="small"
              onPress={() => navigation.navigate('ForgotPassword')}
            />
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <Button
                title="Cadastre-se"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('Register')}
                textStyle={styles.registerLink}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.xxl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  logoText: {
    fontSize: DIMENSIONS.fontSize.title,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: DIMENSIONS.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  userTypeContainer: {
    marginBottom: DIMENSIONS.spacing.xl,
  },
  userTypeLabel: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.sm,
    textAlign: 'center',
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: DIMENSIONS.spacing.md,
  },
  userTypeButton: {
    flex: 1,
    maxWidth: 120,
  },
  form: {
    marginBottom: DIMENSIONS.spacing.xl,
  },
  loginButton: {
    marginTop: DIMENSIONS.spacing.lg,
  },
  linksContainer: {
    alignItems: 'center',
    gap: DIMENSIONS.spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: '600',
  },
});

export default LoginScreen;

