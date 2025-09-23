'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { useFamily } from '../../../contexts/FamilyContext';
import { familyGroupService } from '../../../services/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import SuccessModal from './SuccessModal';
import styles from './page.module.css';

function CreateFamilyContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshGroups } = useFamily();
  const [formData, setFormData] = useState({
    familyName: '',
    description: ''
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
      const response = await familyGroupService.createGroup({
        name: formData.familyName,
        description: formData.description
      });

      const newGroup = response.data;
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
      const response = await familyGroupService.joinGroup(joinCode.trim().toUpperCase());
      
      // Atualizar lista de grupos
      await refreshGroups();
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Erro ao entrar na família:', error);
      setError(error.response?.data?.message || 'Código inválido ou erro ao entrar na família');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ familyName: '', description: '' });
    setInviteCode('');
    setShowSuccess(false);
    setError('');
  };

  if (isCreated) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h1 className={styles.title}>Família criada com sucesso!</h1>
          <p className={styles.subtitle}>
            A {formData.familyName} foi criada. Agora você pode convidar outros membros.
          </p>
          
          <div className={styles.inviteSection}>
            <h2>Convite para a família</h2>
            <div className={styles.codeContainer}>
              <span className={styles.inviteCode}>{inviteCode}</span>
              <button onClick={copyToClipboard} className={styles.copyButton}>
                📋 Copiar
              </button>
            </div>
            <p className={styles.codeInfo}>
              Compartilhe este código com os membros da sua família para que possam se juntar ao grupo.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/dashboard" className="btn btn-primary">
              Ir para o Painel
            </Link>
            <button 
              onClick={() => setIsCreated(false)} 
              className="btn btn-secondary"
            >
              Criar Outra Família
            </button>
          </div>
        </div>
      </div>
    );
  }

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

                <div className="form-group">
                  <label htmlFor="description">Descrição (opcional)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Uma breve descrição sobre sua família..."
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
                Já tem um código de convite? Digite abaixo para entrar.
              </p>

              <form className={styles.form} onSubmit={handleJoinGroup}>
                <div className="form-group">
                  <label htmlFor="joinCode">Código de convite</label>
                  <input
                    type="text"
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase());
                      if (error) setError('');
                    }}
                    required
                    placeholder="Ex: GARCIA01, SILVA01..."
                    maxLength={8}
                    style={{ textTransform: 'uppercase' }}
                  />
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
