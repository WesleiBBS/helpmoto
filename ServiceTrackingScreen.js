import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { COLORS, DIMENSIONS, SERVICE_STATUS } from '../../constants';

const ServiceTrackingScreen = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceData();
    
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      updateServiceStatus();
    }, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      
      // Simulação de dados do serviço
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockService = {
        id: serviceId,
        status: SERVICE_STATUS.ACCEPTED,
        type: 'mechanical',
        description: 'Moto não liga',
        requestTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        estimatedArrival: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
        price: 45.00,
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
        },
        destination: {
          latitude: -23.5515,
          longitude: -46.6343,
        },
      };

      const mockProvider = {
        id: '1',
        name: 'João Silva',
        rating: 4.8,
        phone: '(11) 99999-9999',
        vehicle: 'Honda CG 160',
        plate: 'ABC-1234',
        location: {
          latitude: -23.5495,
          longitude: -46.6323,
        },
        photo: null,
      };

      setService(mockService);
      setProvider(mockProvider);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do serviço.');
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = () => {
    // Simulação de atualização de status
    setService(prev => {
      if (!prev) return prev;
      
      const statuses = [
        SERVICE_STATUS.ACCEPTED,
        SERVICE_STATUS.IN_PROGRESS,
        SERVICE_STATUS.COMPLETED,
      ];
      
      const currentIndex = statuses.indexOf(prev.status);
      if (currentIndex < statuses.length - 1) {
        return {
          ...prev,
          status: statuses[currentIndex + 1],
        };
      }
      
      return prev;
    });
  };

  const handleCallProvider = () => {
    if (provider?.phone) {
      const phoneNumber = provider.phone.replace(/\D/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleCancelService = () => {
    Alert.alert(
      'Cancelar Serviço',
      'Tem certeza que deseja cancelar este serviço?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simulação de cancelamento
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert(
                'Serviço Cancelado',
                'Seu serviço foi cancelado com sucesso.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível cancelar o serviço.');
            }
          },
        },
      ]
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case SERVICE_STATUS.PENDING:
        return 'Procurando prestador...';
      case SERVICE_STATUS.ACCEPTED:
        return 'Prestador a caminho';
      case SERVICE_STATUS.IN_PROGRESS:
        return 'Serviço em andamento';
      case SERVICE_STATUS.COMPLETED:
        return 'Serviço concluído';
      case SERVICE_STATUS.CANCELLED:
        return 'Serviço cancelado';
      default:
        return 'Status desconhecido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case SERVICE_STATUS.PENDING:
        return COLORS.warning;
      case SERVICE_STATUS.ACCEPTED:
        return COLORS.info;
      case SERVICE_STATUS.IN_PROGRESS:
        return COLORS.primary;
      case SERVICE_STATUS.COMPLETED:
        return COLORS.success;
      case SERVICE_STATUS.CANCELLED:
        return COLORS.error;
      default:
        return COLORS.gray[500];
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || !service) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Acompanhar Serviço</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(service.status) }]} />
          <View style={styles.statusContent}>
            <Text style={styles.statusText}>{getStatusText(service.status)}</Text>
            {service.status === SERVICE_STATUS.ACCEPTED && service.estimatedArrival && (
              <Text style={styles.estimatedTime}>
                Chegada prevista: {formatTime(service.estimatedArrival)}
              </Text>
            )}
          </View>
        </View>

        {/* Mapa */}
        {service.location && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: service.location.latitude,
                longitude: service.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {/* Localização do cliente */}
              <Marker
                coordinate={service.location}
                title="Sua localização"
                pinColor={COLORS.primary}
              />
              
              {/* Localização do prestador */}
              {provider?.location && (
                <Marker
                  coordinate={provider.location}
                  title={`${provider.name} - ${provider.vehicle}`}
                  pinColor={COLORS.accent}
                />
              )}
              
              {/* Destino */}
              {service.destination && (
                <Marker
                  coordinate={service.destination}
                  title="Destino"
                  pinColor={COLORS.success}
                />
              )}
              
              {/* Rota */}
              {provider?.location && (
                <Polyline
                  coordinates={[provider.location, service.location]}
                  strokeColor={COLORS.primary}
                  strokeWidth={3}
                />
              )}
            </MapView>
          </View>
        )}

        {/* Informações do prestador */}
        {provider && (
          <View style={styles.providerContainer}>
            <Text style={styles.sectionTitle}>Prestador de Serviço</Text>
            <View style={styles.providerCard}>
              <View style={styles.providerInfo}>
                <View style={styles.providerHeader}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={COLORS.accent} />
                    <Text style={styles.rating}>{provider.rating}</Text>
                  </View>
                </View>
                <Text style={styles.providerVehicle}>
                  {provider.vehicle} - {provider.plate}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCallProvider}
              >
                <Ionicons name="call" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Detalhes do serviço */}
        <View style={styles.serviceDetailsContainer}>
          <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
          <View style={styles.serviceDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo:</Text>
              <Text style={styles.detailValue}>Mecânica</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Descrição:</Text>
              <Text style={styles.detailValue}>{service.description}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Solicitado em:</Text>
              <Text style={styles.detailValue}>{formatTime(service.requestTime)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor estimado:</Text>
              <Text style={styles.detailValue}>R$ {service.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          {service.status === SERVICE_STATUS.COMPLETED ? (
            <Button
              title="Avaliar Serviço"
              onPress={() => navigation.navigate('ServiceRating', { serviceId })}
              style={styles.actionButton}
            />
          ) : (
            <Button
              title="Cancelar Serviço"
              variant="danger"
              onPress={handleCancelService}
              style={styles.actionButton}
            />
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
    backgroundColor: COLORS.surface,
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: DIMENSIONS.spacing.md,
  },
  statusContent: {
    flex: 1,
  },
  statusText: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  estimatedTime: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mapContainer: {
    height: 250,
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.borderRadius.md,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  providerContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  providerInfo: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DIMENSIONS.spacing.xs,
  },
  providerName: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    marginLeft: 2,
  },
  providerVehicle: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: DIMENSIONS.spacing.md,
  },
  serviceDetailsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  serviceDetails: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.xs,
  },
  detailLabel: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  actionsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingBottom: DIMENSIONS.spacing.xl,
  },
  actionButton: {
    marginBottom: DIMENSIONS.spacing.md,
  },
});

export default ServiceTrackingScreen;

