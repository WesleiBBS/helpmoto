import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  userType: null,
  token: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: !!action.token,
        token: action.token,
        user: action.user,
        userType: action.userType
      };
    case 'SIGN_IN':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.token,
        user: action.user,
        userType: action.userType
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: null,
        user: null,
        userType: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.user }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const user = await SecureStore.getItemAsync('userData');
        const userType = await SecureStore.getItemAsync('userType');
        
        dispatch({
          type: 'RESTORE_TOKEN',
          token,
          user: user ? JSON.parse(user) : null,
          userType
        });
      } catch (error) {
        console.error('Erro ao restaurar token:', error);
        dispatch({ type: 'RESTORE_TOKEN', token: null });
      }
    };

    restoreToken();
  }, []);

  const signIn = async (token, user, userType) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      await SecureStore.setItemAsync('userType', userType);
      
      dispatch({
        type: 'SIGN_IN',
        token,
        user,
        userType
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      await SecureStore.deleteItemAsync('userType');
      
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      user: userData
    });
  };

  const value = {
    ...state,
    signIn,
    signOut,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

