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

const ActiveServiceScreen = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(SERVICE_STATUS.ACCEPTED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceData();
  }, []);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      
      // Simulação de dados do serviço
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockService = {
        id: serviceId,
        type: 'mechanical',
        description: 'Moto não liga',
        status: SERVICE_STATUS.ACCEPTED,
        requestTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
        estimatedPrice: 45.00,
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Rua das Flores, 123 - Centro',
        },
        destination: {
          latitude: -23.5515,
          longitude: -46.6343,
          address: 'Oficina do João - Rua Augusta, 500',
        },
        client: {
          id: '1',
          name: 'Ana Silva',
          phone: '(11) 99999-9999',
          rating: 4.9,
        },
        providerLocation: {
          latitude: -23.5495,
          longitude: -46.6323,
        },
      };

      setService(mockService);
      setCurrentStatus(mockService.status);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do serviço.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (newStatus) => {
    const statusMessages = {
      [SERVICE_STATUS.IN_PROGRESS]: 'Marcar como "Em Andamento"?',
      [SERVICE_STATUS.COMPLETED]: 'Marcar como "Concluído"?',
    };

    Alert.alert(
      'Atualizar Status',
      statusMessages[newStatus],
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              // Simulação de atualização de status
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setCurrentStatus(newStatus);
              setService(prev => ({ ...prev, status: newStatus }));
              
              if (newStatus === SERVICE_STATUS.COMPLETED) {
                Alert.alert(
                  'Serviço Concluído',
                  'Parabéns! O serviço foi marcado como concluído.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível atualizar o status.');
            }
          },
        },
      ]
    );
  };

  const handleCallClient = () => {
    if (service?.client?.phone) {
      const phoneNumber = service.client.phone.replace(/\D/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleOpenMaps = () => {
    if (service?.location) {
      const { latitude, longitude } = service.location;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
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
      case SERVICE_STATUS.ACCEPTED:
        return 'A caminho do cliente';
      case SERVICE_STATUS.IN_PROGRESS:
        return 'Atendendo o cliente';
      case SERVICE_STATUS.COMPLETED:
        return 'Serviço concluído';
      default:
        return 'Status desconhecido';
    }
  };

  const getNextStatusButton = () => {
    switch (currentStatus) {
      case SERVICE_STATUS.ACCEPTED:
        return {
          title: 'Iniciar Atendimento',
          status: SERVICE_STATUS.IN_PROGRESS,
          variant: 'primary',
        };
      case SERVICE_STATUS.IN_PROGRESS:
        return {
          title: 'Concluir Serviço',
          status: SERVICE_STATUS.COMPLETED,
          variant: 'success',
        };
      default:
        return null;
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

  const nextStatusButton = getNextStatusButton();

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
          <Text style={styles.headerTitle}>Serviço Ativo</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>{getStatusText(currentStatus)}</Text>
        </View>

        {/* Mapa */}
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
              title="Cliente"
              description={service.client.name}
              pinColor={COLORS.primary}
            />
            
            {/* Localização do prestador */}
            <Marker
              coordinate={service.providerLocation}
              title="Sua localização"
              pinColor={COLORS.accent}
            />
            
            {/* Destino */}
            {service.destination && (
              <Marker
                coordinate={service.destination}
                title="Destino"
                description={service.destination.address}
                pinColor={COLORS.success}
              />
            )}
            
            {/* Rota */}
            <Polyline
              coordinates={[service.providerLocation, service.location]}
              strokeColor={COLORS.primary}
              strokeWidth={3}
            />
          </MapView>
          
          <TouchableOpacity
            style={styles.mapsButton}
            onPress={handleOpenMaps}
          >
            <Ionicons name="navigate" size={20} color={COLORS.white} />
            <Text style={styles.mapsButtonText}>Abrir no Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do cliente */}
        <View style={styles.clientContainer}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.clientCard}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{service.client.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={COLORS.accent} />
                <Text style={styles.rating}>{service.client.rating}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCallClient}
            >
              <Ionicons name="call" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Detalhes do serviço */}
        <View style={styles.serviceDetailsContainer}>
          <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
          <View style={styles.serviceDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo:</Text>
              <Text style={styles.detailValue}>{getServiceTypeName(service.type)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Descrição:</Text>
              <Text style={styles.detailValue}>{service.description}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Localização:</Text>
              <Text style={styles.detailValue}>{service.location.address}</Text>
            </View>
            {service.destination && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Destino:</Text>
                <Text style={styles.detailValue}>{service.destination.address}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Solicitado em:</Text>
              <Text style={styles.detailValue}>{formatTime(service.requestTime)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor estimado:</Text>
              <Text style={styles.detailValue}>R$ {service.estimatedPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          {nextStatusButton && (
            <Button
              title={nextStatusButton.title}
              variant={nextStatusButton.variant}
              onPress={() => handleStatusUpdate(nextStatusButton.status)}
              style={styles.actionButton}
            />
          )}
          
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleCallClient}
            >
              <Ionicons name="call-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Ligar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleOpenMaps}
            >
              <Ionicons name="navigate-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Navegar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => {
                // Implementar chat ou mensagens
                Alert.alert('Em breve', 'Funcionalidade de mensagens em desenvolvimento.');
              }}
            >
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Mensagem</Text>
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
    backgroundColor: COLORS.primary,
    marginRight: DIMENSIONS.spacing.md,
  },
  statusText: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  mapContainer: {
    height: 250,
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapsButton: {
    position: 'absolute',
    top: DIMENSIONS.spacing.md,
    right: DIMENSIONS.spacing.md,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  mapsButtonText: {
    color: COLORS.white,
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: '600',
    marginLeft: DIMENSIONS.spacing.xs,
  },
  clientContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.xs,
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
    alignItems: 'flex-start',
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
    marginBottom: DIMENSIONS.spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: DIMENSIONS.spacing.sm,
  },
  quickActionText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.text,
    marginTop: DIMENSIONS.spacing.xs,
  },
});

export default ActiveServiceScreen;

