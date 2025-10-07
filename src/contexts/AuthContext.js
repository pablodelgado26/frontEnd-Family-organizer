'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

// Configuração do axios
const api = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário do localStorage na inicialização
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/login', {
        email,
        password,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const { token: newToken, user } = response.data;

      // Salvar no localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Atualizar estado
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro interno do servidor',
      };
    }
  };

  const register = async (name, email, password, gender, photoUrl = null) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        gender,
        ...(photoUrl && { photoUrl }), // Adiciona photoUrl apenas se fornecido
      });

      const { token, user } = response.data;

      // Salvar no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Atualizar estado
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro interno do servidor',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};