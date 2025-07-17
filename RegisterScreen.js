import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import {
  validateEmail,
  validateCPF,
  validateCNPJ,
  validatePhone,
  validatePassword,
  formatCPF,
  formatCNPJ,
  formatPhone,
} from '../../utils/validation';
import { COLORS, DIMENSIONS, USER_TYPES } from '../../constants';

const RegisterScreen = ({ navigation }) => {
  const [userType, setUserType] = useState(USER_TYPES.CLIENT);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '', // CPF para cliente, CNPJ para prestador
    password: '',
    confirmPassword: '',
    // Campos específicos para prestador
    companyName: '',
    specialties: '',
    // Campos específicos para cliente
    motorcycleBrand: '',
    motorcycleModel: '',
    motorcyclePlate: '',
    motorcycleYear: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { signIn } = useAuth();

  const updateFormData = (field, value) => {
    let formattedValue = value;

    // Formatação automática de campos
    if (field === 'document') {
      if (userType === USER_TYPES.CLIENT) {
        formattedValue = formatCPF(value);
      } else {
        formattedValue = formatCNPJ(value);
      }
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));

    // Remove erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validações comuns
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!formData.document.trim()) {
      newErrors.document = userType === USER_TYPES.CLIENT ? 'CPF é obrigatório' : 'CNPJ é obrigatório';
    } else {
      if (userType === USER_TYPES.CLIENT && !validateCPF(formData.document)) {
        newErrors.document = 'CPF inválido';
      } else if (userType === USER_TYPES.PROVIDER && !validateCNPJ(formData.document)) {
        newErrors.document = 'CNPJ inválido';
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Validações específicas para prestador
    if (userType === USER_TYPES.PROVIDER) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Nome da empresa é obrigatório';
      }

      if (!formData.specialties.trim()) {
        newErrors.specialties = 'Especialidades são obrigatórias';
      }
    }

    // Validações específicas para cliente
    if (userType === USER_TYPES.CLIENT) {
      if (!formData.motorcycleBrand.trim()) {
        newErrors.motorcycleBrand = 'Marca da moto é obrigatória';
      }

      if (!formData.motorcycleModel.trim()) {
        newErrors.motorcycleModel = 'Modelo da moto é obrigatório';
      }

      if (!formData.motorcyclePlate.trim()) {
        newErrors.motorcyclePlate = 'Placa da moto é obrigatória';
      }

      if (!formData.motorcycleYear.trim()) {
        newErrors.motorcycleYear = 'Ano da moto é obrigatório';
      } else {
        const year = parseInt(formData.motorcycleYear);
        const currentYear = new Date().getFullYear();
        if (year < 1980 || year > currentYear + 1) {
          newErrors.motorcycleYear = 'Ano inválido';
        }
      }
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso e política de privacidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulação de cadastro - substituir pela chamada real da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de dados do usuário
      const userData = {
        id: '1',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        document: formData.document,
        userType: userType,
      };

      const token = 'mock_token_123';
      
      await signIn(token, userData, userType);
      
      Alert.alert(
        'Cadastro Realizado',
        'Sua conta foi criada com sucesso!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Erro no Cadastro',
        error.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      document: '',
    }));
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Preencha os dados para se cadastrar
            </Text>
          </View>

          {/* Seletor de tipo de usuário */}
          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeLabel}>Tipo de conta:</Text>
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
            {/* Dados pessoais */}
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              error={errors.name}
              leftIcon="person-outline"
            />

            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <Input
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              error={errors.phone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />

            <Input
              label={userType === USER_TYPES.CLIENT ? 'CPF' : 'CNPJ'}
              placeholder={userType === USER_TYPES.CLIENT ? '000.000.000-00' : '00.000.000/0000-00'}
              value={formData.document}
              onChangeText={(value) => updateFormData('document', value)}
              error={errors.document}
              keyboardType="numeric"
              leftIcon="card-outline"
            />

            {/* Campos específicos para prestador */}
            {userType === USER_TYPES.PROVIDER && (
              <>
                <Text style={styles.sectionTitle}>Dados da Empresa</Text>
                
                <Input
                  label="Nome da Empresa"
                  placeholder="Digite o nome da empresa"
                  value={formData.companyName}
                  onChangeText={(value) => updateFormData('companyName', value)}
                  error={errors.companyName}
                  leftIcon="business-outline"
                />

                <Input
                  label="Especialidades"
                  placeholder="Ex: Mecânica, Elétrica, Pneus..."
                  value={formData.specialties}
                  onChangeText={(value) => updateFormData('specialties', value)}
                  error={errors.specialties}
                  leftIcon="construct-outline"
                  multiline
                  numberOfLines={3}
                />
              </>
            )}

            {/* Campos específicos para cliente */}
            {userType === USER_TYPES.CLIENT && (
              <>
                <Text style={styles.sectionTitle}>Dados da Motocicleta</Text>
                
                <Input
                  label="Marca"
                  placeholder="Ex: Honda, Yamaha, Suzuki..."
                  value={formData.motorcycleBrand}
                  onChangeText={(value) => updateFormData('motorcycleBrand', value)}
                  error={errors.motorcycleBrand}
                  leftIcon="bicycle-outline"
                />

                <Input
                  label="Modelo"
                  placeholder="Ex: CB 600F, YZF-R3, GSX-R750..."
                  value={formData.motorcycleModel}
                  onChangeText={(value) => updateFormData('motorcycleModel', value)}
                  error={errors.motorcycleModel}
                  leftIcon="bicycle-outline"
                />

                <Input
                  label="Placa"
                  placeholder="ABC-1234"
                  value={formData.motorcyclePlate}
                  onChangeText={(value) => updateFormData('motorcyclePlate', value)}
                  error={errors.motorcyclePlate}
                  autoCapitalize="characters"
                  leftIcon="car-outline"
                />

                <Input
                  label="Ano"
                  placeholder="2020"
                  value={formData.motorcycleYear}
                  onChangeText={(value) => updateFormData('motorcycleYear', value)}
                  error={errors.motorcycleYear}
                  keyboardType="numeric"
                  maxLength={4}
                  leftIcon="calendar-outline"
                />
              </>
            )}

            {/* Senha */}
            <Text style={styles.sectionTitle}>Segurança</Text>
            
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              error={errors.password}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Input
              label="Confirmar Senha"
              placeholder="Digite sua senha novamente"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              error={errors.confirmPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            {/* Termos */}
            <View style={styles.termsContainer}>
              <Button
                title={acceptedTerms ? '✓' : ''}
                variant={acceptedTerms ? 'primary' : 'outline'}
                size="small"
                style={styles.checkbox}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
              />
              <Text style={styles.termsText}>
                Aceito os{' '}
                <Text style={styles.termsLink}>Termos de Uso</Text>
                {' '}e{' '}
                <Text style={styles.termsLink}>Política de Privacidade</Text>
              </Text>
            </View>
            {errors.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          {/* Link para login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Button
              title="Faça login"
              variant="ghost"
              size="small"
              onPress={() => navigation.navigate('Login')}
              textStyle={styles.loginLink}
            />
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
  header: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.xl,
  },
  title: {
    fontSize: DIMENSIONS.fontSize.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.xs,
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
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.md,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: DIMENSIONS.spacing.sm,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.error,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  registerButton: {
    marginTop: DIMENSIONS.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: '600',
  },
});

export default RegisterScreen;

