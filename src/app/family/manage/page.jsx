'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useFamilies } from '@/hooks/useFamilies';
import { FamilySelector } from '@/components/FamilySelector';
import { CreateFamilyModal } from '@/components/CreateFamilyModal';
import { JoinFamilyModal } from '@/components/JoinFamilyModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './page.module.css';

function ManageFamilyContent() {
  const router = useRouter();
  const {
    families,
    selectedFamily,
    selectFamily,
    isAdmin,
    createFamily,
    joinFamily,
    joinFamilyTemp,
    leaveFamily,
  } = useFamilies();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [tempCode, setTempCode] = useState(null);
  const [loadingTempCode, setLoadingTempCode] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [error, setError] = useState('');
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  // Buscar membros da família selecionada
  useEffect(() => {
    if (selectedFamily) {
      fetchMembers();
    }
  }, [selectedFamily]);

  // Atualizar tempo restante do código temporário
  useEffect(() => {
    if (tempCode?.expiresAt) {
      const interval = setInterval(() => {
        const now = new Date();
        const expiry = new Date(tempCode.expiresAt);
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeRemaining('Expirado');
          setTempCode(null);
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tempCode]);

  const fetchMembers = async () => {
    if (!selectedFamily) return;

    try {
      setLoadingMembers(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/family-groups/${selectedFamily.id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      setMembers(data.familyGroup?.members || data.members || []);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      setError('Erro ao carregar membros da família');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateFamily = async (name) => {
    try {
      await createFamily(name);
      alert('Família criada com sucesso!');
    } catch (error) {
      throw error;
    }
  };

  const handleJoinFamily = async (inviteCode) => {
    try {
      await joinFamily(inviteCode);
      alert('Você entrou na família com sucesso!');
    } catch (error) {
      throw error;
    }
  };

  const handleJoinFamilyTemp = async (tempInviteCode) => {
    try {
      console.log('Tentando entrar na família com código temporário:', tempInviteCode);
      await joinFamilyTemp(tempInviteCode);
      console.log('Entrada na família bem-sucedida');
      alert('Você entrou na família com sucesso!');
    } catch (error) {
      console.error('Erro ao entrar na família:', error);
      throw error;
    }
  };

  const handleLeaveFamily = async () => {
    if (!selectedFamily) return;
    
    if (!confirm('Tem certeza que deseja sair desta família?')) return;

    try {
      await leaveFamily(selectedFamily.id);
      alert('Você saiu da família com sucesso!');
      
      // Se não houver mais famílias, redirecionar para criar família
      if (families.length <= 1) {
        router.push('/family/create');
      }
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const generateTempCode = async () => {
    if (!selectedFamily) {
      console.error('Nenhuma família selecionada');
      setError('Nenhuma família selecionada');
      return;
    }

    if (!isAdmin()) {
      console.error('Usuário não é admin');
      setError('Apenas administradores podem gerar códigos');
      return;
    }

    try {
      setLoadingTempCode(true);
      setError('');
      const token = localStorage.getItem('token');

      console.log('Gerando código temporário para família:', selectedFamily.id);

      const response = await axios.post(
        `http://localhost:4000/family-groups/${selectedFamily.id}/temp-invite`,
        {},
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      console.log('Código temporário gerado:', data);
      setTempCode(data);
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      setError(error.response?.data?.error || 'Erro ao gerar código temporário');
    } finally {
      setLoadingTempCode(false);
    }
  };

  const handleRemoveMember = async (userId, userName) => {
    if (!confirm(`Tem certeza que deseja remover ${userName} da família?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:4000/family-groups/${selectedFamily.id}/members/${userId}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Membro removido com sucesso!');
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao remover membro');
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      alert('Erro ao copiar código');
    }
  };

  const formatExpiryTime = (expiresAt) => {
    if (!expiresAt) return '--:--';
    const date = new Date(expiresAt);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (families.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>Você ainda não participa de nenhuma família</h2>
        <div className={styles.actions}>
          <button 
            onClick={() => setShowCreateModal(true)}
            className={styles.btnPrimary}
          >
            Criar Nova Família
          </button>
          <button 
            onClick={() => setShowJoinModal(true)}
            className={styles.btnSecondary}
          >
            Entrar em Família
          </button>
        </div>

        <CreateFamilyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateFamily={handleCreateFamily}
        />

        <JoinFamilyModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoinFamily={handleJoinFamily}
          onJoinFamilyTemp={handleJoinFamilyTemp}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Voltar ao Dashboard
        </Link>
        <h1>Minhas Famílias</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.selectorSection}>
          <div className={styles.selectorWrapper}>
            <FamilySelector
              families={families}
              selectedFamily={selectedFamily}
              onSelectFamily={selectFamily}
              onCreateFamily={() => setShowCreateModal(true)}
            />

            <button
              onClick={() => setShowJoinModal(true)}
              className={styles.btnJoin}
            >
              ➕ Entrar em Família
            </button>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* Código Temporário - ÚNICO */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              ⏱️ Código de Convite Temporário
            </h2>
            <span className={`${styles.badge} ${styles.badgeTemp}`}>
              Expira em 15 min
            </span>
          </div>
          <p className={styles.cardDescription}>
            Gere um código de 6 caracteres que expira em 15 minutos. 
            Ideal para convites rápidos e seguros. Apenas você (admin) pode gerar códigos.
          </p>

          {!isAdmin() ? (
            <div className={styles.noCode}>
              <p className={styles.noCodeText}>
                🔒 Apenas administradores da família podem gerar códigos de convite temporários.
              </p>
            </div>
          ) : tempCode?.code && timeRemaining !== 'Expirado' ? (
            <>
              <div className={styles.codeDisplay}>
                <div className={styles.codeBox}>
                  <span className={styles.codeLabel}>Código:</span>
                  <span className={styles.codeValue}>{tempCode.code}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(tempCode.code, 'temporary')}
                  className={styles.copyBtn}
                  disabled={copySuccess === 'temporary'}
                >
                  {copySuccess === 'temporary' ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>

              <div className={styles.expiryInfo}>
                <div className={styles.expiryDetail}>
                  <span className={styles.expiryLabel}>⏰ Tempo restante:</span>
                  <span className={styles.expiryValue}>{timeRemaining}</span>
                </div>
                <div className={styles.expiryDetail}>
                  <span className={styles.expiryLabel}>🕐 Expira às:</span>
                  <span className={styles.expiryValue}>
                    {formatExpiryTime(tempCode.expiresAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={generateTempCode}
                className={styles.btnPrimary}
                disabled={loadingTempCode}
                style={{ marginTop: '16px' }}
              >
                {loadingTempCode ? 'Gerando...' : '🔄 Gerar Novo Código'}
              </button>
            </>
          ) : (
            <div className={styles.noCode}>
              <p className={styles.noCodeText}>
                Nenhum código ativo no momento. Clique no botão abaixo para gerar um novo código.
              </p>
              <button
                onClick={generateTempCode}
                className={styles.btnPrimary}
                disabled={loadingTempCode}
              >
                {loadingTempCode ? 'Gerando...' : '✨ Gerar Código de Convite'}
              </button>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className={styles.infoSection}>
          <div className={styles.infoHeader}>
            <span className={styles.infoHeaderIcon}>ℹ️</span>
            <h3 className={styles.infoHeaderTitle}>Como funciona?</h3>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIcon}>⚡</div>
                <h4 className={styles.infoTitle}>Gere Quando Precisar</h4>
              </div>
              <p className={styles.infoDescription}>Clique no botão para gerar um código novo sempre que quiser convidar alguém.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIcon}>⏱️</div>
                <h4 className={styles.infoTitle}>15 Minutos</h4>
              </div>
              <p className={styles.infoDescription}>Cada código é válido por apenas 15 minutos. Depois disso, expira automaticamente.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIcon}>🔒</div>
                <h4 className={styles.infoTitle}>Seguro</h4>
              </div>
              <p className={styles.infoDescription}>Códigos temporários são mais seguros. Se alguém descobrir, logo ficará inválido.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIcon}>♾️</div>
                <h4 className={styles.infoTitle}>Múltiplos Usos</h4>
              </div>
              <p className={styles.infoDescription}>Enquanto válido, o código pode ser usado por várias pessoas para entrar no grupo.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIcon}>🔄</div>
                <h4 className={styles.infoTitle}>Regenere</h4>
              </div>
              <p className={styles.infoDescription}>Pode gerar novos códigos quantas vezes quiser. O código anterior será substituído.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIcon}>👥</div>
                <h4 className={styles.infoTitle}>Apenas Admin</h4>
              </div>
              <p className={styles.infoDescription}>Somente administradores do grupo podem gerar códigos de convite.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageFamily() {
  return (
    <ProtectedRoute>
      <ManageFamilyContent />
    </ProtectedRoute>
  );
}
