'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function CreateFamily() {
  const [formData, setFormData] = useState({
    familyName: '',
    description: ''
  });
  const [inviteCode, setInviteCode] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você integrará com o backend
    console.log('Dados da família:', formData);
    
    // Simular criação da família
    const generatedCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setInviteCode(generatedCode);
    setIsCreated(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    alert('Código copiado para a área de transferência!');
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
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Voltar ao início
        </Link>
      </div>
      
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Criar sua família</h1>
            <p className={styles.subtitle}>
              Dê um nome especial para o seu grupo familiar e comece a organizar tudo em um só lugar.
            </p>
          </div>

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

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Criar Família
            </button>
          </form>

          <div className={styles.info}>
            <h3>O que acontece depois?</h3>
            <ul className={styles.infoList}>
              <li>✅ Você receberá um código de convite</li>
              <li>✅ Poderá compartilhar com outros membros</li>
              <li>✅ Todos terão acesso ao painel familiar</li>
              <li>✅ Poderão gerenciar consultas, eventos e mais</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
