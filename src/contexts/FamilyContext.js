'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FamilyContext = createContext({});

export function FamilyProvider({ children }) {
  const { user } = useAuth();
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar famílias do usuário
  const loadUserFamilies = async () => {
    if (!user) {
      setFamilies([]);
      setSelectedFamily(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/family-groups', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // A API retorna { message: "...", familyGroups: [...] }
      const userFamilies = response.data.familyGroups || response.data || [];

      setFamilies(userFamilies);

      // Definir a família selecionada: prioriza a salva no localStorage, senão pega a primeira
      const savedFamilyId = localStorage.getItem('selectedFamilyId');

      let familyToSet = null;
      if (savedFamilyId) {
        familyToSet = userFamilies.find(family => family.id.toString() === savedFamilyId);
      }
      if (!familyToSet && userFamilies.length > 0) {
        familyToSet = userFamilies[0];
      }

      if (familyToSet) {
        setSelectedFamily(familyToSet);
        localStorage.setItem('selectedFamilyId', familyToSet.id.toString());
      } else {
        setSelectedFamily(null);
        localStorage.removeItem('selectedFamilyId');
      }
    } catch (error) {
      console.error('FamilyContext: Erro ao carregar famílias:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar famílias quando usuário fizer login
  useEffect(() => {
    if (user) {
      loadUserFamilies();
    } else {
      setFamilies([]);
      setSelectedFamily(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const selectFamily = (family) => {
    setSelectedFamily(family);
    localStorage.setItem('selectedFamilyId', family.id.toString());
  };

  const isAdmin = () => {
    return selectedFamily?.role === 'admin';
  };

  const refreshFamilies = async () => {
    await loadUserFamilies();
  };

  const value = {
    selectedFamily,
    families,
    loading,
    selectFamily,
    isAdmin,
    refreshFamilies,
    // Aliases para compatibilidade com código existente
    currentGroup: selectedFamily,
    groups: families,
    switchGroup: selectFamily,
    refreshGroups: refreshFamilies,
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