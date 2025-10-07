'use client';

import { useState } from 'react';
import styles from './Modal.module.css';

export function CreateFamilyModal({ isOpen, onClose, onCreateFamily }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Nome da família é obrigatório');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onCreateFamily(name);
      
      setName('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Criar Nova Família</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome da Família</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Família Silva"
              autoFocus
            />
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
              {loading ? 'Criando...' : 'Criar Família'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
