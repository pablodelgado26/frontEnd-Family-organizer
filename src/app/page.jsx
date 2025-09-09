'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você integrará com o backend
    console.log('Dados do formulário:', formData);
    
    // Simular login/registro bem-sucedido
    if (isLogin) {
      // Redirecionar para o dashboard após login
      window.location.href = '/dashboard';
    } else {
      // Redirecionar para criação da família após registro
      window.location.href = '/family/create';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Family <span className={styles.titleBlue}>Organizer</span>
          </h1>
          <p className={styles.subtitle}>
            Centralize a organização da sua família em um só lugar. 
            Gerencie consultas, eventos, anotações e memórias familiares.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📅</span>
              <span>Agenda compartilhada</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏥</span>
              <span>Consultas médicas</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📝</span>
              <span>Anotações familiares</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📸</span>
              <span>Galeria de fotos</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.formTabs}>
            <button 
              className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Entrar
            </button>
            <button 
              className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Criar Conta
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Nome completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="Digite seu nome completo"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Digite seu e-mail"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Digite sua senha"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="gender">Gênero</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required={!isLogin}
                >
                  <option value="">Selecione seu gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro-nao-dizer">Prefiro não dizer</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          {isLogin && (
            <div className={styles.forgotPassword}>
              <Link href="/reset-password">Esqueceu sua senha?</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
