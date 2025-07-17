import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components';
import AuthNavigator from './AuthNavigator';

// Importar telas
import { HomeScreen, ServiceTrackingScreen, ServiceHistoryScreen } from '../screens/client';
import { ProviderHomeScreen, ActiveServiceScreen } from '../screens/provider';
import { AdminDashboardScreen, UserManagementScreen } from '../screens/admin';
import PrivacySettingsScreen from '../screens/privacy/PrivacySettingsScreen';

import { COLORS, USER_TYPES } from '../constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação por abas para clientes
const ClientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="History" 
        component={ServiceHistoryScreen}
        options={{ title: 'Histórico' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PrivacySettingsScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Navegação por abas para prestadores
const ProviderTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ProviderHome') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'ProviderProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="ProviderHome" 
        component={ProviderHomeScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={ProviderHomeScreen} // Placeholder
        options={{ title: 'Ganhos' }}
      />
      <Tab.Screen 
        name="ProviderProfile" 
        component={PrivacySettingsScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Navegação por abas para administradores
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'AdminProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagementScreen}
        options={{ title: 'Usuários' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={AdminDashboardScreen} // Placeholder
        options={{ title: 'Relatórios' }}
      />
      <Tab.Screen 
        name="AdminProfile" 
        component={PrivacySettingsScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Navegação principal para usuários autenticados
const MainNavigator = () => {
  const { userType } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Navegação baseada no tipo de usuário */}
      {userType === USER_TYPES.CLIENT && (
        <>
          <Stack.Screen name="ClientTabs" component={ClientTabNavigator} />
          <Stack.Screen name="ServiceTracking" component={ServiceTrackingScreen} />
        </>
      )}
      
      {userType === USER_TYPES.PROVIDER && (
        <>
          <Stack.Screen name="ProviderTabs" component={ProviderTabNavigator} />
          <Stack.Screen name="ActiveService" component={ActiveServiceScreen} />
        </>
      )}
      
      {userType === USER_TYPES.ADMIN && (
        <>
          <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
        </>
      )}
      
      {/* Telas comuns */}
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
    </Stack.Navigator>
  );
};

// Navegador raiz da aplicação
const AppNavigator = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Carregando aplicativo..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

