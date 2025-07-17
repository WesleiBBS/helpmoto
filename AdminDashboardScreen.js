import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, DIMENSIONS } from '../../constants';

const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalServices: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingApprovals: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulação de dados do dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats = {
        totalUsers: 1247,
        totalProviders: 89,
        totalServices: 3456,
        totalRevenue: 45678.90,
        activeServices: 12,
        pendingApprovals: 5,
      };
      
      const mockActivity = [
        {
          id: '1',
          type: 'new_user',
          description: 'Novo usuário cadastrado: João Silva',
          time: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
          id: '2',
          type: 'service_completed',
          description: 'Serviço concluído: Mecânica - R$ 45,00',
          time: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
          id: '3',
          type: 'provider_approval',
          description: 'Prestador aprovado: Maria Santos',
          time: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: '4',
          type: 'payment_processed',
          description: 'Pagamento processado: R$ 125,50',
          time: new Date(Date.now() - 45 * 60 * 1000),
        },
      ];
      
      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_user':
        return 'person-add-outline';
      case 'service_completed':
        return 'checkmark-circle-outline';
      case 'provider_approval':
        return 'shield-checkmark-outline';
      case 'payment_processed':
        return 'card-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'new_user':
        return COLORS.primary;
      case 'service_completed':
        return COLORS.success;
      case 'provider_approval':
        return COLORS.info;
      case 'payment_processed':
        return COLORS.accent;
      default:
        return COLORS.gray[500];
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const renderStatCard = (title, value, icon, color, onPress) => (
    <TouchableOpacity
      key={title}
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.statContent}>
        <View style={styles.statHeader}>
          <Text style={styles.statTitle}>{title}</Text>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderActivityItem = (item) => (
    <View key={item.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: getActivityColor(item.type) }]}>
        <Ionicons
          name={getActivityIcon(item.type)}
          size={16}
          color={COLORS.white}
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{formatTime(item.time)}</Text>
      </View>
    </View>
  );

  const renderQuickAction = (title, icon, color, onPress) => (
    <TouchableOpacity
      key={title}
      style={styles.quickActionButton}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={COLORS.white} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Painel Administrativo</Text>
            <Text style={styles.subtitle}>HelpMoto - Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('AdminProfile')}
          >
            <Ionicons name="person-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Estatísticas principais */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Usuários',
              stats.totalUsers.toLocaleString(),
              'people-outline',
              COLORS.primary,
              () => navigation.navigate('UserManagement')
            )}
            {renderStatCard(
              'Prestadores',
              stats.totalProviders.toLocaleString(),
              'construct-outline',
              COLORS.secondary,
              () => navigation.navigate('ProviderManagement')
            )}
            {renderStatCard(
              'Serviços',
              stats.totalServices.toLocaleString(),
              'checkmark-circle-outline',
              COLORS.success,
              () => navigation.navigate('ServiceManagement')
            )}
            {renderStatCard(
              'Receita',
              `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              'wallet-outline',
              COLORS.accent,
              () => navigation.navigate('FinancialReports')
            )}
          </View>
        </View>

        {/* Estatísticas em tempo real */}
        <View style={styles.realtimeContainer}>
          <Text style={styles.sectionTitle}>Tempo Real</Text>
          <View style={styles.realtimeGrid}>
            {renderStatCard(
              'Serviços Ativos',
              stats.activeServices.toString(),
              'time-outline',
              COLORS.info,
              () => navigation.navigate('ActiveServices')
            )}
            {renderStatCard(
              'Aprovações Pendentes',
              stats.pendingApprovals.toString(),
              'hourglass-outline',
              COLORS.warning,
              () => navigation.navigate('PendingApprovals')
            )}
          </View>
        </View>

        {/* Ações rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {renderQuickAction(
              'Usuários',
              'people-outline',
              COLORS.primary,
              () => navigation.navigate('UserManagement')
            )}
            {renderQuickAction(
              'Prestadores',
              'construct-outline',
              COLORS.secondary,
              () => navigation.navigate('ProviderManagement')
            )}
            {renderQuickAction(
              'Preços',
              'pricetag-outline',
              COLORS.accent,
              () => navigation.navigate('PriceManagement')
            )}
            {renderQuickAction(
              'Relatórios',
              'bar-chart-outline',
              COLORS.info,
              () => navigation.navigate('Reports')
            )}
            {renderQuickAction(
              'Configurações',
              'settings-outline',
              COLORS.gray[600],
              () => navigation.navigate('AdminSettings')
            )}
            {renderQuickAction(
              'Suporte',
              'help-circle-outline',
              COLORS.warning,
              () => navigation.navigate('Support')
            )}
          </View>
        </View>

        {/* Atividade recente */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Atividade Recente</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ActivityLog')}
            >
              <Text style={styles.viewAllText}>Ver tudo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivity.map(renderActivityItem)}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  greeting: {
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
  },
  statsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.md,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  statTitle: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: 'bold',
  },
  realtimeContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  realtimeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    width: '30%',
    marginBottom: DIMENSIONS.spacing.md,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  quickActionText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.text,
    textAlign: 'center',
  },
  activityContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.xl,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  viewAllText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DIMENSIONS.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
  },
});

export default AdminDashboardScreen;

