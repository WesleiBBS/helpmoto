import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../../components';
import { COLORS, DIMENSIONS, USER_TYPES } from '../../constants';

const UserManagementScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'all', name: 'Todos', count: 0 },
    { id: 'client', name: 'Clientes', count: 0 },
    { id: 'provider', name: 'Prestadores', count: 0 },
    { id: 'active', name: 'Ativos', count: 0 },
    { id: 'inactive', name: 'Inativos', count: 0 },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, selectedFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Simulação de dados de usuários
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(11) 99999-9999',
          userType: USER_TYPES.CLIENT,
          status: 'active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
          totalServices: 15,
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '(11) 88888-8888',
          userType: USER_TYPES.PROVIDER,
          status: 'active',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lastLogin: new Date(Date.now() - 30 * 60 * 1000),
          totalServices: 89,
          rating: 4.8,
        },
        {
          id: '3',
          name: 'Carlos Oliveira',
          email: 'carlos@email.com',
          phone: '(11) 77777-7777',
          userType: USER_TYPES.CLIENT,
          status: 'inactive',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          totalServices: 3,
        },
        {
          id: '4',
          name: 'Ana Costa',
          email: 'ana@email.com',
          phone: '(11) 66666-6666',
          userType: USER_TYPES.PROVIDER,
          status: 'active',
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          lastLogin: new Date(Date.now() - 5 * 60 * 1000),
          totalServices: 156,
          rating: 4.9,
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtro por busca
    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      );
    }

    // Filtro por categoria
    switch (selectedFilter) {
      case 'client':
        filtered = filtered.filter(user => user.userType === USER_TYPES.CLIENT);
        break;
      case 'provider':
        filtered = filtered.filter(user => user.userType === USER_TYPES.PROVIDER);
        break;
      case 'active':
        filtered = filtered.filter(user => user.status === 'active');
        break;
      case 'inactive':
        filtered = filtered.filter(user => user.status === 'inactive');
        break;
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = (user, action) => {
    const actions = {
      view: () => navigation.navigate('UserDetails', { userId: user.id }),
      edit: () => navigation.navigate('EditUser', { userId: user.id }),
      block: () => handleBlockUser(user),
      unblock: () => handleUnblockUser(user),
      delete: () => handleDeleteUser(user),
    };

    actions[action]?.();
  };

  const handleBlockUser = (user) => {
    Alert.alert(
      'Bloquear Usuário',
      `Tem certeza que deseja bloquear ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simulação de bloqueio
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setUsers(prev =>
                prev.map(u =>
                  u.id === user.id ? { ...u, status: 'inactive' } : u
                )
              );
              
              Alert.alert('Sucesso', 'Usuário bloqueado com sucesso.');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível bloquear o usuário.');
            }
          },
        },
      ]
    );
  };

  const handleUnblockUser = (user) => {
    Alert.alert(
      'Desbloquear Usuário',
      `Tem certeza que deseja desbloquear ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbloquear',
          onPress: async () => {
            try {
              // Simulação de desbloqueio
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setUsers(prev =>
                prev.map(u =>
                  u.id === user.id ? { ...u, status: 'active' } : u
                )
              );
              
              Alert.alert('Sucesso', 'Usuário desbloqueado com sucesso.');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível desbloquear o usuário.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Excluir Usuário',
      `ATENÇÃO: Esta ação é irreversível!\n\nTem certeza que deseja excluir ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simulação de exclusão
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setUsers(prev => prev.filter(u => u.id !== user.id));
              
              Alert.alert('Sucesso', 'Usuário excluído com sucesso.');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o usuário.');
            }
          },
        },
      ]
    );
  };

  const getUserTypeIcon = (userType) => {
    return userType === USER_TYPES.CLIENT ? 'person-outline' : 'construct-outline';
  };

  const getUserTypeColor = (userType) => {
    return userType === USER_TYPES.CLIENT ? COLORS.primary : COLORS.secondary;
  };

  const getStatusColor = (status) => {
    return status === 'active' ? COLORS.success : COLORS.error;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatLastLogin = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Online agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter.id && styles.filterButtonTextActive,
        ]}
      >
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userNameContainer}>
            <Ionicons
              name={getUserTypeIcon(item.userType)}
              size={20}
              color={getUserTypeColor(item.userType)}
            />
            <Text style={styles.userName}>{item.name}</Text>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
          </View>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.phone}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            Alert.alert(
              'Ações do Usuário',
              `Escolha uma ação para ${item.name}:`,
              [
                { text: 'Ver Detalhes', onPress: () => handleUserAction(item, 'view') },
                { text: 'Editar', onPress: () => handleUserAction(item, 'edit') },
                {
                  text: item.status === 'active' ? 'Bloquear' : 'Desbloquear',
                  onPress: () => handleUserAction(item, item.status === 'active' ? 'block' : 'unblock'),
                },
                {
                  text: 'Excluir',
                  style: 'destructive',
                  onPress: () => handleUserAction(item, 'delete'),
                },
                { text: 'Cancelar', style: 'cancel' },
              ]
            );
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Cadastro</Text>
          <Text style={styles.statValue}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Último acesso</Text>
          <Text style={styles.statValue}>{formatLastLogin(item.lastLogin)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Serviços</Text>
          <Text style={styles.statValue}>{item.totalServices}</Text>
        </View>
        {item.rating && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avaliação</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={COLORS.accent} />
              <Text style={styles.statValue}>{item.rating}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={COLORS.gray[400]} />
      <Text style={styles.emptyStateTitle}>Nenhum usuário encontrado</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'Tente ajustar os filtros de busca.' : 'Não há usuários cadastrados.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddUser')}
        >
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          style={styles.searchInput}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Lista de usuários */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
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
  addButton: {
    padding: DIMENSIONS.spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    paddingVertical: DIMENSIONS.spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
  },
  filterButton: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
    borderRadius: DIMENSIONS.borderRadius.md,
    backgroundColor: COLORS.surface,
    marginRight: DIMENSIONS.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  userItem: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DIMENSIONS.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.xs,
  },
  userName: {
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: DIMENSIONS.spacing.sm,
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  userEmail: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
  },
  moreButton: {
    padding: DIMENSIONS.spacing.xs,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: DIMENSIONS.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default UserManagementScreen;

