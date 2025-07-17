import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { useLGPD } from '../../contexts/LGPDContext';
import { COLORS, DIMENSIONS } from '../../constants';

const PrivacySettingsScreen = ({ navigation }) => {
  const {
    privacySettings,
    updatePrivacySettings,
    exportUserData,
    deleteUserData,
    consentStatus,
  } = useLGPD();

  const [loading, setLoading] = useState(false);

  const handleSettingChange = async (setting, value) => {
    try {
      await updatePrivacySettings({ [setting]: value });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a configuração.');
    }
  };

  const handleExportData = async () => {
    Alert.alert(
      'Exportar Dados',
      'Deseja exportar todos os seus dados pessoais? Você receberá um arquivo com todas as informações que temos sobre você.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Exportar',
          onPress: async () => {
            try {
              setLoading(true);
              const exportedData = await exportUserData();
              
              // Em uma implementação real, isso enviaria o arquivo por email
              // ou disponibilizaria para download
              Alert.alert(
                'Dados Exportados',
                'Seus dados foram exportados com sucesso. Em breve você receberá um email com o arquivo.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível exportar seus dados.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'ATENÇÃO: Esta ação é irreversível!\n\nTodos os seus dados serão permanentemente removidos de nossos servidores. Você não poderá recuperar sua conta ou histórico de serviços.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir Permanentemente',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmação Final',
              'Tem certeza absoluta que deseja excluir sua conta? Digite "EXCLUIR" para confirmar.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Confirmar Exclusão',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setLoading(true);
                      await deleteUserData();
                      
                      Alert.alert(
                        'Conta Excluída',
                        'Sua conta foi excluída com sucesso. Todos os seus dados foram removidos.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              // Redireciona para tela de login
                              navigation.reset({
                                index: 0,
                                routes: [{ name: 'Auth' }],
                              });
                            },
                          },
                        ]
                      );
                    } catch (error) {
                      Alert.alert('Erro', 'Não foi possível excluir sua conta.');
                    } finally {
                      setLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    title,
    description,
    settingKey,
    icon,
    isRequired = false
  ) => (
    <View key={settingKey} style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.settingContent}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingTitle}>{title}</Text>
          {isRequired && (
            <Text style={styles.requiredLabel}>Obrigatório</Text>
          )}
        </View>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={privacySettings[settingKey]}
        onValueChange={(value) => handleSettingChange(settingKey, value)}
        disabled={isRequired}
        trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
        thumbColor={privacySettings[settingKey] ? COLORS.white : COLORS.gray[500]}
      />
    </View>
  );

  const renderActionButton = (title, description, onPress, variant = 'outline', icon) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === 'danger' && styles.dangerButton,
      ]}
      onPress={onPress}
    >
      <View style={styles.actionIcon}>
        <Ionicons
          name={icon}
          size={24}
          color={variant === 'danger' ? COLORS.error : COLORS.primary}
        />
      </View>
      <View style={styles.actionContent}>
        <Text
          style={[
            styles.actionTitle,
            variant === 'danger' && styles.dangerText,
          ]}
        >
          {title}
        </Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacidade e Dados</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Informações LGPD */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.success} />
            <Text style={styles.infoTitle}>Seus Dados Protegidos</Text>
          </View>
          <Text style={styles.infoText}>
            O HelpMoto está em conformidade com a Lei Geral de Proteção de Dados (LGPD). 
            Você tem controle total sobre seus dados pessoais e pode gerenciar suas 
            preferências de privacidade a qualquer momento.
          </Text>
        </View>

        {/* Configurações de Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações de Privacidade</Text>
          
          {renderSettingItem(
            'Coleta de Dados de Uso',
            'Permite coletar dados sobre como você usa o app para melhorar nossos serviços.',
            'dataCollection',
            'analytics-outline'
          )}
          
          {renderSettingItem(
            'Rastreamento de Localização',
            'Necessário para encontrar prestadores próximos e calcular rotas.',
            'locationTracking',
            'location-outline',
            true
          )}
          
          {renderSettingItem(
            'Análises e Estatísticas',
            'Permite usar seus dados para análises internas e relatórios estatísticos.',
            'analytics',
            'bar-chart-outline'
          )}
          
          {renderSettingItem(
            'Comunicações de Marketing',
            'Receber ofertas especiais, promoções e novidades por email ou push.',
            'marketing',
            'mail-outline'
          )}
          
          {renderSettingItem(
            'Notificações Personalizadas',
            'Personalizar notificações baseadas no seu histórico de uso.',
            'notifications',
            'notifications-outline'
          )}
        </View>

        {/* Status dos Consentimentos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status dos Consentimentos</Text>
          <View style={styles.consentStatus}>
            <Text style={styles.consentText}>
              Você pode visualizar e gerenciar todos os seus consentimentos dados 
              para o tratamento de dados pessoais.
            </Text>
            <Button
              title="Ver Histórico de Consentimentos"
              variant="outline"
              size="small"
              onPress={() => navigation.navigate('ConsentHistory')}
              style={styles.consentButton}
            />
          </View>
        </View>

        {/* Seus Direitos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus Direitos (LGPD)</Text>
          
          {renderActionButton(
            'Exportar Meus Dados',
            'Baixe uma cópia de todos os seus dados pessoais.',
            handleExportData,
            'outline',
            'download-outline'
          )}
          
          {renderActionButton(
            'Política de Privacidade',
            'Leia nossa política completa de privacidade e proteção de dados.',
            () => navigation.navigate('PrivacyPolicy'),
            'outline',
            'document-text-outline'
          )}
          
          {renderActionButton(
            'Termos de Uso',
            'Consulte os termos de uso do aplicativo.',
            () => navigation.navigate('TermsOfService'),
            'outline',
            'reader-outline'
          )}
          
          {renderActionButton(
            'Contatar DPO',
            'Entre em contato com nosso Encarregado de Proteção de Dados.',
            () => navigation.navigate('ContactDPO'),
            'outline',
            'person-outline'
          )}
        </View>

        {/* Zona de Perigo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            Zona de Perigo
          </Text>
          
          {renderActionButton(
            'Excluir Minha Conta',
            'Remove permanentemente sua conta e todos os dados associados.',
            handleDeleteAccount,
            'danger',
            'trash-outline'
          )}
        </View>

        {/* Informações de Contato */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dúvidas sobre privacidade? Entre em contato conosco:
          </Text>
          <Text style={styles.contactInfo}>
            Email: privacidade@helpmoto.com.br{'\n'}
            Telefone: (11) 3000-0000
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: DIMENSIONS.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    margin: DIMENSIONS.spacing.lg,
    padding: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  infoTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: DIMENSIONS.spacing.md,
  },
  infoText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
  },
  dangerTitle: {
    color: COLORS.error,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  settingIcon: {
    marginRight: DIMENSIONS.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.xs,
  },
  settingTitle: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  requiredLabel: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.warning,
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: DIMENSIONS.spacing.xs,
    paddingVertical: 2,
    borderRadius: DIMENSIONS.borderRadius.sm,
  },
  settingDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  consentStatus: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  consentText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: DIMENSIONS.spacing.md,
  },
  consentButton: {
    alignSelf: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
    marginBottom: DIMENSIONS.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dangerButton: {
    borderColor: COLORS.error + '40',
    backgroundColor: COLORS.error + '10',
  },
  actionIcon: {
    marginRight: DIMENSIONS.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  dangerText: {
    color: COLORS.error,
  },
  actionDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: DIMENSIONS.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  contactInfo: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PrivacySettingsScreen;

