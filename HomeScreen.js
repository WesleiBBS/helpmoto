import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentLocation, getAddressFromCoordinates } from '../../utils/location';
import { COLORS, DIMENSIONS, SERVICE_STATUS } from '../../constants';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [serviceType, setServiceType] = useState('mechanical');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);

  const serviceTypes = [
    { id: 'mechanical', name: 'Mecânica', icon: 'construct-outline' },
    { id: 'electrical', name: 'Elétrica', icon: 'flash-outline' },
    { id: 'tire', name: 'Pneu', icon: 'ellipse-outline' },
    { id: 'fuel', name: 'Combustível', icon: 'car-outline' },
    { id: 'towing', name: 'Reboque', icon: 'car-sport-outline' },
    { id: 'other', name: 'Outros', icon: 'help-outline' },
  ];

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      const address = await getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );
      
      if (address) {
        setCurrentAddress(address.formattedAddress);
      }
    } catch (error) {
      Alert.alert(
        'Erro de Localização',
        'Não foi possível obter sua localização. Verifique se o GPS está ativado e as permissões foram concedidas.',
        [
          {
            text: 'Tentar Novamente',
            onPress: loadCurrentLocation,
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRequestService = async () => {
    if (!currentLocation) {
      Alert.alert('Erro', 'Localização não disponível. Tente novamente.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o problema.');
      return;
    }

    setLoading(true);
    try {
      // Simulação de solicitação de serviço
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Solicitação Enviada',
        'Sua solicitação foi enviada! Estamos procurando um prestador próximo.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ServiceTracking', {
              serviceId: 'mock_service_123',
            }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível enviar sua solicitação. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderServiceTypeButton = (service) => (
    <TouchableOpacity
      key={service.id}
      style={[
        styles.serviceTypeButton,
        serviceType === service.id && styles.serviceTypeButtonActive,
      ]}
      onPress={() => setServiceType(service.id)}
    >
      <Ionicons
        name={service.icon}
        size={DIMENSIONS.iconSize.lg}
        color={serviceType === service.id ? COLORS.white : COLORS.primary}
      />
      <Text
        style={[
          styles.serviceTypeText,
          serviceType === service.id && styles.serviceTypeTextActive,
        ]}
      >
        {service.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}!</Text>
            <Text style={styles.subtitle}>Como podemos ajudar hoje?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Mapa */}
        <View style={styles.mapContainer}>
          {currentLocation && !locationLoading ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              showsMyLocationButton
            >
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Sua localização"
                description={currentAddress}
              />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location-outline" size={48} color={COLORS.gray[400]} />
              <Text style={styles.mapPlaceholderText}>
                {locationLoading ? 'Carregando localização...' : 'Localização indisponível'}
              </Text>
              {!locationLoading && (
                <Button
                  title="Tentar Novamente"
                  variant="outline"
                  size="small"
                  onPress={loadCurrentLocation}
                  style={styles.retryButton}
                />
              )}
            </View>
          )}
        </View>

        {/* Endereços */}
        <View style={styles.addressContainer}>
          <Input
            label="Sua localização atual"
            value={currentAddress}
            editable={false}
            leftIcon="location-outline"
            style={styles.addressInput}
          />
          
          <Input
            label="Destino (opcional)"
            placeholder="Para onde levar sua moto?"
            value={destinationAddress}
            onChangeText={setDestinationAddress}
            leftIcon="flag-outline"
            style={styles.addressInput}
          />
        </View>

        {/* Tipos de serviço */}
        <View style={styles.serviceTypesContainer}>
          <Text style={styles.sectionTitle}>Tipo de serviço</Text>
          <View style={styles.serviceTypesGrid}>
            {serviceTypes.map(renderServiceTypeButton)}
          </View>
        </View>

        {/* Descrição do problema */}
        <View style={styles.descriptionContainer}>
          <Input
            label="Descreva o problema"
            placeholder="Ex: Moto não liga, pneu furado, sem combustível..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            leftIcon="document-text-outline"
          />
        </View>

        {/* Botão de solicitação */}
        <View style={styles.requestContainer}>
          <Button
            title="Solicitar Socorro"
            onPress={handleRequestService}
            loading={loading}
            size="large"
            style={styles.requestButton}
          />
        </View>

        {/* Ações rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ServiceHistory')}
            >
              <Ionicons name="time-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Histórico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PaymentMethods')}
            >
              <Ionicons name="card-outline" size={24} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Pagamento</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Emergency')}
            >
              <Ionicons name="call-outline" size={24} color={COLORS.error} />
              <Text style={styles.quickActionText}>Emergência</Text>
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
  mapContainer: {
    height: 200,
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.borderRadius.md,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
  },
  mapPlaceholderText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: DIMENSIONS.spacing.sm,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: DIMENSIONS.spacing.sm,
  },
  addressContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  addressInput: {
    marginBottom: DIMENSIONS.spacing.sm,
  },
  serviceTypesContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
  },
  serviceTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceTypeButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  serviceTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  serviceTypeText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.text,
    marginTop: DIMENSIONS.spacing.xs,
    textAlign: 'center',
  },
  serviceTypeTextActive: {
    color: COLORS.white,
  },
  descriptionContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  requestContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  requestButton: {
    backgroundColor: COLORS.accent,
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

export default HomeScreen;

