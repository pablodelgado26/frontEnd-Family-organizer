'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

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
      // Validação básica no frontend
      if (!email || !password) {
        return {
          success: false,
          error: 'E-mail e senha são obrigatórios'
        };
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
      
      // Tratamento de erros específicos
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response) {
        // Erro do servidor (4xx, 5xx)
        errorMessage = error.response.data?.message 
          || error.response.data?.error 
          || `Erro ${error.response.status}`;
        
        // Mensagens específicas por código
        if (error.response.status === 401) {
          errorMessage = 'E-mail ou senha incorretos';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuário não encontrado';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        }
      } else if (error.request) {
        // Requisição foi feita mas sem resposta
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password, gender, photoUrl = null) => {
    try {
      // Validação básica no frontend
      if (!name || !email || !password || !gender) {
        return {
          success: false,
          error: 'Todos os campos são obrigatórios'
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'A senha deve ter no mínimo 6 caracteres'
        };
      }

      const requestData = {
        name,
        email,
        password,
        gender,
        ...(photoUrl && { photoUrl }), // Adiciona photoUrl apenas se fornecido
      };

      console.log('📤 Enviando dados de registro:', {
        ...requestData,
        password: '***' // Não logar a senha
      });

      const response = await axios.post('http://localhost:4000/auth/register', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Registro bem-sucedido:', response.data);

      const { token, user } = response.data;

      // Salvar no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Atualizar estado
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro no registro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Tratamento de erros específicos
      let errorMessage = 'Erro ao criar conta';
      
      if (error.response) {
        // Erro do servidor (4xx, 5xx)
        errorMessage = error.response.data?.message 
          || error.response.data?.error 
          || `Erro ${error.response.status}`;
        
        // Mensagens específicas por código
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos. Verifique os campos.';
        } else if (error.response.status === 409) {
          errorMessage = 'Este e-mail já está cadastrado';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        }
      } else if (error.request) {
        // Requisição foi feita mas sem resposta
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
      }
      
      return {
        success: false,
        error: errorMessage,
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