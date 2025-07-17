import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    // Solicita permissão de localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão de localização negada');
    }

    // Obtém a localização atual
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 10000,
      maximumAge: 60000, // Cache por 1 minuto
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    throw error;
  }
};

export const watchLocation = async (callback, options = {}) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão de localização negada');
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Atualiza a cada 5 segundos
        distanceInterval: 10, // Ou quando mover 10 metros
        ...options,
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        });
      }
    );

    return subscription;
  } catch (error) {
    console.error('Erro ao monitorar localização:', error);
    throw error;
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses.length > 0) {
      const address = addresses[0];
      return {
        street: address.street || '',
        number: address.streetNumber || '',
        neighborhood: address.district || '',
        city: address.city || '',
        state: address.region || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        formattedAddress: formatAddress(address),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter endereço:', error);
    throw error;
  }
};

export const getCoordinatesFromAddress = async (address) => {
  try {
    const locations = await Location.geocodeAsync(address);
    
    if (locations.length > 0) {
      return {
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter coordenadas:', error);
    throw error;
  }
};

const formatAddress = (address) => {
  const parts = [];
  
  if (address.street) {
    let streetPart = address.street;
    if (address.streetNumber) {
      streetPart += `, ${address.streetNumber}`;
    }
    parts.push(streetPart);
  }
  
  if (address.district) {
    parts.push(address.district);
  }
  
  if (address.city) {
    parts.push(address.city);
  }
  
  if (address.region) {
    parts.push(address.region);
  }
  
  return parts.join(', ');
};

export const isLocationPermissionGranted = async () => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
};

export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

