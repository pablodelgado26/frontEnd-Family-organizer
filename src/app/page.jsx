'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const { login, register, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: ''
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Não mostrar nada enquanto carrega ou se já estiver logado
  if (loading || user) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpar erro quando começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        // Fazer login
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error);
        }
      } else {
        // Fazer registro
        // Converter gênero para o formato esperado pelo backend (M/F)
        let genderCode = '';
        switch (formData.gender) {
          case 'masculino':
            genderCode = 'M';
            break;
          case 'feminino':
            genderCode = 'F';
            break;
          default:
            genderCode = 'M'; // Default
        }

        const result = await register(
          formData.name, 
          formData.email, 
          formData.password, 
          genderCode
        );
        
        if (result.success) {
          router.push('/family/create');
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
      console.error('Erro na autenticação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      gender: ''
    });
    setError('');
  };

  const toggleForm = (loginMode) => {
    setIsLogin(loginMode);
    resetForm();
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
              onClick={() => toggleForm(true)}
              type="button"
            >
              Entrar
            </button>
            <button 
              className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
              onClick={() => toggleForm(false)}
              type="button"
            >
              Criar Conta
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

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
                minLength="6"
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
                </select>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                isLogin ? 'Entrando...' : 'Criando conta...'
              ) : (
                isLogin ? 'Entrar' : 'Criar Conta'
              )}
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
