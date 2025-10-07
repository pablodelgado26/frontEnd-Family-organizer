import { useState, useEffect } from 'react';
import api from '@/services/api';

export function useFamilies() {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar famílias do usuário
  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await api.get('/family-groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = response.data;
      const familyGroups = data.familyGroups || [];
      setFamilies(familyGroups);
      
      // Selecionar última família usada ou primeira
      const lastFamilyId = localStorage.getItem('selectedFamilyId');
      const familyToSelect = familyGroups.find(f => f.id === Number(lastFamilyId)) 
        || familyGroups[0];
      
      if (familyToSelect) {
        setSelectedFamily(familyToSelect);
        localStorage.setItem('selectedFamilyId', familyToSelect.id);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const selectFamily = (family) => {
    setSelectedFamily(family);
    localStorage.setItem('selectedFamilyId', family.id);
  };

  const isAdmin = () => {
    return selectedFamily?.role === 'admin';
  };

  const createFamily = async (name) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.post('/family-groups', 
        { name },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = response.data;
      
      // Recarregar famílias
      await fetchFamilies();
      
      return data.familyGroup;
    } catch (err) {
      throw err;
    }
  };

  const joinFamily = async (inviteCode) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.post('/family-groups/join', 
        { inviteCode },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data || response.status >= 400) {
        const error = response.data;
        throw new Error(error.error);
      }
      
      // Recarregar famílias
      await fetchFamilies();
      
      return true;
    } catch (err) {
      throw err;
    }
  };

  const joinFamilyTemp = async (tempInviteCode) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.post('/family-groups/join-temp', 
        { tempInviteCode },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data || response.status >= 400) {
        const error = response.data;
        throw new Error(error.error || 'Código inválido ou expirado');
      }
      
      // Recarregar famílias
      await fetchFamilies();
      
      return true;
    } catch (err) {
      throw err;
    }
  };

  const leaveFamily = async (familyId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.delete(`/family-groups/${familyId}/leave`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data || response.status >= 400) {
        const error = response.data;
        throw new Error(error.error);
      }
      
      // Recarregar famílias
      await fetchFamilies();
      
      return true;
    } catch (err) {
      throw err;
    }
  };

  return {
    families,
    selectedFamily,
    selectFamily,
    isAdmin,
    createFamily,
    joinFamily,
    joinFamilyTemp,
    leaveFamily,
    loading,
    error,
    refetch: fetchFamilies
  };
}
