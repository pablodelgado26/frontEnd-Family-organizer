'use client';

import { useState } from 'react';
import styles from './Modal.module.css';

export function JoinFamilyModal({ isOpen, onClose, onJoinFamily, onJoinFamilyTemp }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joinType, setJoinType] = useState('temp'); // 'temp' ou 'permanent'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Código de convite é obrigatório');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (joinType === 'temp') {
        await onJoinFamilyTemp(inviteCode.toUpperCase());
      } else {
        await onJoinFamily(inviteCode.toUpperCase());
      }
      
      setInviteCode('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao entrar na família');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Entrar em Família</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.joinTypeSelector}>
          <button
            type="button"
            className={`${styles.joinTypeBtn} ${joinType === 'temp' ? styles.active : ''}`}
            onClick={() => setJoinType('temp')}
          >
            ⏱️ Código Temporário
          </button>
          <button
            type="button"
            className={`${styles.joinTypeBtn} ${joinType === 'permanent' ? styles.active : ''}`}
            onClick={() => setJoinType('permanent')}
          >
            🔒 Código Permanente
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>
              {joinType === 'temp' ? 'Código Temporário (6 caracteres)' : 'Código Permanente (9 caracteres)'}
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder={joinType === 'temp' ? 'Ex: ABC123' : 'Ex: ABC123XYZ'}
              maxLength={joinType === 'temp' ? 6 : 9}
              autoFocus
              style={{ textTransform: 'uppercase' }}
            />
            <small>
              {joinType === 'temp' 
                ? '⏱️ Códigos temporários são válidos por 15 minutos' 
                : '🔒 Códigos permanentes nunca expiram'}
            </small>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.modalActions}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className={styles.btnSecondary}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={styles.btnPrimary}
            >
              {loading ? 'Entrando...' : 'Entrar na Família'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
