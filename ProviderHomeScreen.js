import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, DIMENSIONS, SERVICE_STATUS } from '../../constants';

const ProviderHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    todayServices: 0,
    rating: 0,
    totalServices: 0,
  });

  useEffect(() => {
    loadProviderData();
    if (isOnline) {
      loadAvailableServices();
    }
  }, [isOnline]);

  const loadProviderData = async () => {
    try {
      // Simulação de dados do prestador
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats = {
        todayEarnings: 125.50,
        todayServices: 3,
        rating: 4.8,
        totalServices: 247,
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Erro ao carregar dados do prestador:', error);
    }
  };

  const loadAvailableServices = async () => {
    try {
      // Simulação de serviços disponíveis
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockServices = [
        {
          id: '1',
          type: 'mechanical',
          description: 'Moto não liga',
          location: {
            latitude: -23.5505,
            longitude: -46.6333,
            address: 'Rua das Flores, 123 - Centro',
          },
          distance: 2.5,
          estimatedPrice: 45.00,
          requestTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
          client: {
            name: 'Ana Silva',
            rating: 4.9,
          },
        },
        {
          id: '2',
          type: 'tire',
          description: 'Pneu furado',
          location: {
            latitude: -23.5515,
            longitude: -46.6343,
            address: 'Av. Paulista, 1000 - Bela Vista',
          },
          distance: 1.8,
          estimatedPrice: 25.00,
          requestTime: new Date(Date.now() - 3 * 60 * 1000), // 3 minutos atrás
          client: {
            name: 'Carlos Santos',
            rating: 4.7,
          },
        },
      ];
      
      setAvailableServices(mockServices);
    } catch (error) {
      console.error('Erro ao carregar serviços disponíveis:', error);
    }
  };

  const handleToggleOnline = (value) => {
    setIsOnline(value);
    if (value) {
      Alert.alert(
        'Status Online',
        'Você está agora disponível para receber chamados.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Status Offline',
        'Você não receberá novos chamados.',
        [{ text: 'OK' }]
      );
      setAvailableServices([]);
    }
  };

  const handleAcceptService = (service) => {
    Alert.alert(
      'Aceitar Serviço',
      `Deseja aceitar o serviço de ${service.client.name}?\n\nTipo: ${getServiceTypeName(service.type)}\nDistância: ${service.distance}km\nValor estimado: R$ ${service.estimatedPrice.toFixed(2)}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceitar',
          onPress: async () => {
            try {
              // Simulação de aceitar serviço
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setActiveService(service);
              setAvailableServices(prev => prev.filter(s => s.id !== service.id));
              
              navigation.navigate('ActiveService', { serviceId: service.id });
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível aceitar o serviço.');
            }
          },
        },
      ]
    );
  };

  const getServiceTypeName = (type) => {
    switch (type) {
      case 'mechanical':
        return 'Mecânica';
      case 'electrical':
        return 'Elétrica';
      case 'tire':
        return 'Pneu';
      case 'fuel':
        return 'Combustível';
      case 'towing':
        return 'Reboque';
      default:
        return 'Outros';
    }
  };

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case 'mechanical':
        return 'construct-outline';
      case 'electrical':
        return 'flash-outline';
      case 'tire':
        return 'ellipse-outline';
      case 'fuel':
        return 'car-outline';
      case 'towing':
        return 'car-sport-outline';
      default:
        return 'help-outline';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    } else {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const renderServiceCard = (service) => (
    <View key={service.id} style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceTypeContainer}>
          <Ionicons
            name={getServiceTypeIcon(service.type)}
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.serviceType}>
            {getServiceTypeName(service.type)}
          </Text>
        </View>
        <Text style={styles.serviceTime}>
          {formatTime(service.requestTime)}
        </Text>
      </View>
      
      <Text style={styles.serviceDescription}>
        {service.description}
      </Text>
      
      <View style={styles.serviceLocation}>
        <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {service.location.address}
        </Text>
      </View>
      
      <View style={styles.serviceDetails}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>
            Cliente: {service.client.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={styles.rating}>{service.client.rating}</Text>
          </View>
        </View>
        
        <View style={styles.serviceMetrics}>
          <Text style={styles.distance}>
            {service.distance}km
          </Text>
          <Text style={styles.price}>
            R$ {service.estimatedPrice.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.serviceActions}>
        <Button
          title="Aceitar"
          onPress={() => handleAcceptService(service)}
          style={styles.acceptButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}!</Text>
            <Text style={styles.subtitle}>
              {isOnline ? 'Você está online' : 'Você está offline'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('ProviderProfile')}
          >
            <Ionicons name="person-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Status Toggle */}
        <View style={styles.statusContainer}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Status de Disponibilidade</Text>
            <Text style={styles.statusDescription}>
              {isOnline 
                ? 'Recebendo chamados' 
                : 'Não recebendo chamados'
              }
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
            thumbColor={isOnline ? COLORS.white : COLORS.gray[500]}
          />
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estatísticas de Hoje</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>R$ {stats.todayEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Ganhos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.todayServices}</Text>
              <Text style={styles.statLabel}>Serviços</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.rating}</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalServices}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Serviços Disponíveis */}
        {isOnline && (
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>
              Chamados Disponíveis ({availableServices.length})
            </Text>
            
            {availableServices.length > 0 ? (
              availableServices.map(renderServiceCard)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={48} color={COLORS.gray[400]} />
                <Text style={styles.emptyStateText}>
                  Nenhum chamado disponível no momento
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Ações rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ProviderHistory')}
            >
              <Ionicons name="time-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Histórico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Earnings')}
            >
              <Ionicons name="wallet-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Ganhos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ProviderSettings')}
            >
              <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Configurações</Text>
            </TouchableOpacity>
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  statValue: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  servicesContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  serviceCard: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
    marginBottom: DIMENSIONS.spacing.md,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  serviceTime: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
  },
  serviceDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  serviceLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  locationText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: DIMENSIONS.spacing.xs,
    flex: 1,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  serviceMetrics: {
    alignItems: 'flex-end',
  },
  distance: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  price: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  serviceActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.xl,
  },
  emptyStateText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: DIMENSIONS.spacing.sm,
    textAlign: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.xl,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: DIMENSIONS.spacing.md,
  },
  quickActionText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.text,
    marginTop: DIMENSIONS.spacing.xs,
  },
});

export default ProviderHomeScreen;

