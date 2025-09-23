'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { familyGroupService } from '../services/api';
import { useAuth } from './AuthContext';

const FamilyContext = createContext({});

export function FamilyProvider({ children }) {
  const { user } = useAuth();
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar grupos do usuário
  const loadUserGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await familyGroupService.getMyGroups();
      const userGroups = response.data;
      
      setGroups(userGroups);
      
      // Se não há grupo atual mas há grupos disponíveis, selecionar o primeiro
      if (!currentGroup && userGroups.length > 0) {
        setCurrentGroup(userGroups[0]);
        localStorage.setItem('currentGroupId', userGroups[0].id.toString());
      }
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar grupo salvo no localStorage
  useEffect(() => {
    if (user && groups.length > 0) {
      const savedGroupId = localStorage.getItem('currentGroupId');
      if (savedGroupId) {
        const savedGroup = groups.find(group => group.id.toString() === savedGroupId);
        if (savedGroup) {
          setCurrentGroup(savedGroup);
        }
      }
    }
  }, [user, groups]);

  // Carregar grupos quando usuário fizer login
  useEffect(() => {
    if (user) {
      loadUserGroups();
    } else {
      setGroups([]);
      setCurrentGroup(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const switchGroup = (group) => {
    setCurrentGroup(group);
    localStorage.setItem('currentGroupId', group.id.toString());
  };

  const refreshGroups = () => {
    loadUserGroups();
  };

  const value = {
    currentGroup,
    groups,
    loading,
    switchGroup,
    refreshGroups,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily deve ser usado dentro de um FamilyProvider');
  }
  return context;
};