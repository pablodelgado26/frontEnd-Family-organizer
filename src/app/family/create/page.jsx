'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useFamily } from '../../../contexts/FamilyContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import SuccessModal from './SuccessModal';
import styles from './page.module.css';

// Configuração do axios
const api = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function CreateFamilyContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshGroups } = useFamily();
  const [formData, setFormData] = useState({
    familyName: ''
  });
  const [inviteCode, setInviteCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/family-groups', {
        name: formData.familyName
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      // A API retorna { message: "...", familyGroup: { id, name, inviteCode, ... } }
      const newGroup = response.data.familyGroup || response.data;
      setInviteCode(newGroup.inviteCode);
      setShowSuccess(true);
      
      // Atualizar lista de grupos
      await refreshGroups();
      
    } catch (error) {
      console.error('Erro ao criar família:', error);
      setError(error.response?.data?.message || 'Erro ao criar família');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Usar apenas o endpoint de código temporário
      const response = await api.post('/family-groups/join-temp', {
        tempInviteCode: joinCode.trim().toUpperCase()
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Atualizar lista de grupos
      await refreshGroups();
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Erro ao entrar na família:', error);
      setError(error.response?.data?.message || 'Código inválido ou expirado');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ familyName: '' });
    setInviteCode('');
    setShowSuccess(false);
    setError('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    alert('Código copiado para a área de transferência!');
  };

  return (
    <>
      <SuccessModal
        isOpen={showSuccess}
        onClose={resetForm}
        familyName={formData.familyName}
        inviteCode={inviteCode}
        onGoToDashboard={() => router.push('/dashboard')}
      />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/dashboard" className={styles.backLink}>
            ← Voltar ao painel
          </Link>
        </div>
        
        <div className={styles.formContainer}>
          <div className={styles.optionsContainer}>
            <div className={styles.optionCard}>
              <h2 className={styles.optionTitle}>Criar Nova Família</h2>
              <p className={styles.optionDescription}>
                Crie um novo grupo familiar e convide outros membros.
              </p>
              
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="familyName">Nome da família</label>
                  <input
                    type="text"
                    id="familyName"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Família Silva, Casa dos Garcia..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando...' : 'Criar Família'}
                </button>
              </form>
            </div>

            <div className={styles.separator}>OU</div>

            <div className={styles.optionCard}>
              <h2 className={styles.optionTitle}>Entrar numa Família</h2>
              <p className={styles.optionDescription}>
                Peça ao administrador do grupo para gerar um código de convite temporário.
              </p>

              <form className={styles.form} onSubmit={handleJoinGroup}>
                <div className="form-group">
                  <label htmlFor="joinCode">
                    Código de Convite (6 caracteres)
                  </label>
                  <input
                    type="text"
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase());
                      if (error) setError('');
                    }}
                    required
                    placeholder="Ex: ABC123"
                    maxLength={6}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <small style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: '8px', display: 'block' }}>
                    ⏱️ Códigos são válidos por apenas 15 minutos
                  </small>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar na Família'}
                </button>
              </form>
            </div>
          </div>

          <div className={styles.info}>
            <h3>Como funciona?</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>👨‍👩‍👧‍👦</span>
                <h4>Crie ou Entre</h4>
                <p>Crie uma nova família ou entre numa existente com um código</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🔗</span>
                <h4>Compartilhe</h4>
                <p>Convide outros membros compartilhando o código de convite</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📱</span>
                <h4>Organize</h4>
                <p>Gerencie consultas, eventos, anotações e memórias em família</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CreateFamily() {
  return (
    <ProtectedRoute>
      <CreateFamilyContent />
    </ProtectedRoute>
  );
}