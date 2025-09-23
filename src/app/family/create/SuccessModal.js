'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  familyName, 
  inviteCode, 
  onGoToDashboard 
}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    alert('Código copiado para a área de transferência!');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>🎉</div>
        <h1 className={styles.title}>Família criada com sucesso!</h1>
        <p className={styles.subtitle}>
          A {familyName} foi criada. Agora você pode convidar outros membros.
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
            onClick={onClose} 
            className="btn btn-secondary"
          >
            Criar Outra Família
          </button>
        </div>
      </div>
    </div>
  );
}