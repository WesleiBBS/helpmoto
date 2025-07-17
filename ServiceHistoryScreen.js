import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, DIMENSIONS, SERVICE_STATUS } from '../../constants';

const ServiceHistoryScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadServiceHistory();
  }, []);

  const loadServiceHistory = async () => {
    try {
      setLoading(true);
      
      // Simulação de dados do histórico
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockServices = [
        {
          id: '1',
          type: 'mechanical',
          description: 'Moto não liga',
          status: SERVICE_STATUS.COMPLETED,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
          price: 45.00,
          provider: {
            name: 'João Silva',
            rating: 4.8,
          },
          location: 'Rua das Flores, 123 - Centro',
        },
        {
          id: '2',
          type: 'tire',
          description: 'Pneu furado',
          status: SERVICE_STATUS.COMPLETED,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 semana atrás
          price: 25.00,
          provider: {
            name: 'Maria Santos',
            rating: 4.9,
          },
          location: 'Av. Paulista, 1000 - Bela Vista',
        },
        {
          id: '3',
          type: 'fuel',
          description: 'Sem combustível',
          status: SERVICE_STATUS.CANCELLED,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 semanas atrás
          price: 0,
          provider: null,
          location: 'Rua Augusta, 500 - Consolação',
        },
        {
          id: '4',
          type: 'electrical',
          description: 'Problema na bateria',
          status: SERVICE_STATUS.COMPLETED,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 mês atrás
          price: 80.00,
          provider: {
            name: 'Carlos Oliveira',
            rating: 4.7,
          },
          location: 'Rua da Consolação, 200 - Centro',
        },
      ];
      
      setServices(mockServices);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServiceHistory();
    setRefreshing(false);
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

  const getStatusText = (status) => {
    switch (status) {
      case SERVICE_STATUS.COMPLETED:
        return 'Concluído';
      case SERVICE_STATUS.CANCELLED:
        return 'Cancelado';
      case SERVICE_STATUS.IN_PROGRESS:
        return 'Em andamento';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case SERVICE_STATUS.COMPLETED:
        return COLORS.success;
      case SERVICE_STATUS.CANCELLED:
        return COLORS.error;
      case SERVICE_STATUS.IN_PROGRESS:
        return COLORS.primary;
      default:
        return COLORS.warning;
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id })}
    >
      <View style={styles.serviceHeader}>
        <View style={styles.serviceTypeContainer}>
          <Ionicons
            name={getServiceTypeIcon(item.type)}
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.serviceType}>
            {getServiceTypeName(item.type)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.serviceDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.serviceDetails}>
        <View style={styles.serviceLocation}>
          <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        
        <View style={styles.serviceMeta}>
          <Text style={styles.serviceDate}>
            {formatDate(item.date)} às {formatTime(item.date)}
          </Text>
          {item.status === SERVICE_STATUS.COMPLETED && (
            <Text style={styles.servicePrice}>
              R$ {item.price.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
      
      {item.provider && (
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>
            Prestador: {item.provider.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={styles.rating}>{item.provider.rating}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color={COLORS.gray[400]} />
      <Text style={styles.emptyStateTitle}>Nenhum serviço encontrado</Text>
      <Text style={styles.emptyStateText}>
        Você ainda não solicitou nenhum serviço.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Serviços</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  serviceItem: {
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
  statusBadge: {
    paddingHorizontal: DIMENSIONS.spacing.sm,
    paddingVertical: DIMENSIONS.spacing.xs,
    borderRadius: DIMENSIONS.borderRadius.sm,
  },
  statusText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  serviceDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.sm,
    lineHeight: 20,
  },
  serviceDetails: {
    marginBottom: DIMENSIONS.spacing.sm,
  },
  serviceLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.xs,
  },
  locationText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: DIMENSIONS.spacing.xs,
    flex: 1,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDate: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
  },
  servicePrice: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  providerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: DIMENSIONS.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  providerName: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  emptyStateText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ServiceHistoryScreen;

