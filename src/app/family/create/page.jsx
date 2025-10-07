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
      const response = await axios.post('http://localhost:4000/family-groups', {
        name: formData.familyName
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
      const code = joinCode.trim().toUpperCase();
      
      console.log('🔑 Código digitado:', code);
      console.log('🔑 Tamanho do código:', code.length);
      console.log('🪙 Token presente:', !!token);
      
      let response;
      let success = false;
      
      // Tentar primeiro com endpoint de código temporário (6 caracteres)
      if (code.length === 6) {
        try {
          console.log('📡 Tentando /family-groups/join-temp com código de 6 dígitos');
          response = await axios.post('http://localhost:4000/family-groups/join-temp', {
            tempInviteCode: code
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('✅ Sucesso com join-temp:', response.data);
          success = true;
        } catch (tempError) {
          console.log('❌ join-temp falhou:', tempError.response?.status, tempError.response?.data);
        }
      }
      
      // Se não teve sucesso, tentar endpoint regular (código permanente)
      if (!success) {
        console.log('📡 Tentando /family-groups/join com código permanente');
        console.log('📦 Payload sendo enviado:', { inviteCode: code });
        console.log('🔐 Headers:', {
          'Authorization': `Bearer ${token ? token.substring(0, 20) + '...' : 'AUSENTE'}`,
          'Content-Type': 'application/json'
        });
        
        try {
          response = await axios.post('http://localhost:4000/family-groups/join', {
            inviteCode: code
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('✅ Sucesso com join:', response.data);
          success = true;
        } catch (joinError) {
          console.log('❌ join também falhou');
          console.log('❌ Status code:', joinError.response?.status);
          console.log('❌ Status text:', joinError.response?.statusText);
          console.log('❌ Response data:', joinError.response?.data);
          console.log('❌ Response headers:', joinError.response?.headers);
          console.log('❌ Request data:', joinError.config?.data);
          throw joinError; // Re-throw para ser capturado pelo catch externo
        }
      }
      
      if (!success) {
        throw new Error('Não foi possível entrar na família com este código');
      }
      
      console.log('✅ Entrada na família bem-sucedida');
      alert('✅ Você entrou na família com sucesso!');
      
      // Atualizar lista de grupos
      await refreshGroups();
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('❌ Erro final ao entrar na família:', error);
      console.error('Status:', error.response?.status);
      console.error('Detalhes:', error.response?.data);
      
      let errorMessage = 'Código inválido ou expirado';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = 'Código inválido. Verifique se digitou corretamente.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Código não encontrado ou expirado.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Você já faz parte desta família.';
      }
      
      setError(errorMessage);
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