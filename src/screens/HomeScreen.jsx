import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Ionicons } from '../components/Icons';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, DIMENSIONS } from '../constants';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const loadCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setCurrentLocation(location);
          setCurrentAddress('São Paulo, SP - Brasil');
          setLocationLoading(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          // Localização padrão (São Paulo)
          setCurrentLocation({
            latitude: -23.5505,
            longitude: -46.6333
          });
          setCurrentAddress('São Paulo, SP - Brasil');
          setLocationLoading(false);
        }
      );
    } else {
      // Localização padrão se geolocalização não suportada
      setCurrentLocation({
        latitude: -23.5505,
        longitude: -46.6333
      });
      setCurrentAddress('São Paulo, SP - Brasil');
      setLocationLoading(false);
    }
  };

  const handleRequestService = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!currentLocation) {
      alert('Localização não disponível. Tente novamente.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor, descreva o problema.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Solicitação enviada! Estamos procurando um prestador próximo.');
    } catch (error) {
      alert('Não foi possível enviar sua solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${DIMENSIONS.spacing.lg}px`,
    backgroundColor: COLORS.surface,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const mapStyle = {
    height: '200px',
    margin: `0 ${DIMENSIONS.spacing.lg}px ${DIMENSIONS.spacing.lg}px`,
    borderRadius: DIMENSIONS.borderRadius.md,
    overflow: 'hidden'
  };

  const sectionStyle = {
    padding: `0 ${DIMENSIONS.spacing.lg}px ${DIMENSIONS.spacing.lg}px`
  };

  const serviceGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: DIMENSIONS.spacing.sm,
    marginTop: DIMENSIONS.spacing.md
  };

  const serviceButtonStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: DIMENSIONS.spacing.md,
    backgroundColor: isActive ? COLORS.primary : COLORS.surface,
    color: isActive ? COLORS.white : COLORS.text,
    border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
    borderRadius: DIMENSIONS.borderRadius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '80px'
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ 
            fontSize: DIMENSIONS.fontSize.xl, 
            fontWeight: 'bold', 
            color: COLORS.text,
            margin: 0 
          }}>
            Olá, {user?.name?.split(' ')[0]}!
          </h1>
          <p style={{ 
            fontSize: DIMENSIONS.fontSize.sm, 
            color: COLORS.textSecondary,
            margin: '4px 0 0 0'
          }}>
            Como podemos ajudar hoje?
          </p>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          backgroundColor: COLORS.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: `1px solid ${COLORS.border}`
        }}>
          <Ionicons name="person-outline" size={24} color={COLORS.primary} />
        </div>
      </div>

      {/* Mapa */}
      <div style={mapStyle}>
        {currentLocation && !locationLoading ? (
          <MapContainer
            center={[currentLocation.latitude, currentLocation.longitude]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
              <Popup>Sua localização atual</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.gray[100]
          }}>
            <Ionicons name="location-outline" size={48} color={COLORS.gray[400]} />
            <p style={{ 
              color: COLORS.textSecondary, 
              marginTop: DIMENSIONS.spacing.sm 
            }}>
              {locationLoading ? 'Carregando localização...' : 'Localização indisponível'}
            </p>
          </div>
        )}
      </div>

      {/* Endereços */}
      <div style={sectionStyle}>
        <Input
          label="Sua localização atual"
          value={currentAddress}
          leftIcon="location-outline"
          editable={false}
        />
        
        <Input
          label="Destino (opcional)"
          placeholder="Para onde levar sua moto?"
          value={destinationAddress}
          onChangeText={setDestinationAddress}
          leftIcon="flag-outline"
        />
      </div>

      {/* Tipos de serviço */}
      <div style={sectionStyle}>
        <h3 style={{ 
          fontSize: DIMENSIONS.fontSize.lg, 
          fontWeight: '600', 
          color: COLORS.text, 
          marginBottom: DIMENSIONS.spacing.md 
        }}>
          Tipo de serviço
        </h3>
        <div style={serviceGridStyle}>
          {serviceTypes.map(service => (
            <div
              key={service.id}
              style={serviceButtonStyle(serviceType === service.id)}
              onClick={() => setServiceType(service.id)}
            >
              <Ionicons
                name={service.icon}
                size={DIMENSIONS.iconSize.lg}
                color={serviceType === service.id ? COLORS.white : COLORS.primary}
              />
              <span style={{ 
                fontSize: DIMENSIONS.fontSize.xs, 
                marginTop: DIMENSIONS.spacing.xs,
                textAlign: 'center'
              }}>
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Descrição do problema */}
      <div style={sectionStyle}>
        <Input
          label="Descreva o problema"
          placeholder="Ex: Moto não liga, pneu furado, sem combustível..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          leftIcon="document-text-outline"
        />
      </div>

      {/* Botão de solicitação */}
      <div style={sectionStyle}>
        <Button
          title="Solicitar Socorro"
          onClick={handleRequestService}
          loading={loading}
          size="large"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default HomeScreen;
