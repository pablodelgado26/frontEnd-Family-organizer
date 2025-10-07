'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './page.module.css';
import api from '@/services/api';

function ProfilePage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'masculino',
    photoFile: null,
    photoPreview: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || 'masculino',
        photoFile: null,
        photoPreview: user.photoUrl || null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photoFile: file,
          photoPreview: reader.result
        });
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photoFile: null,
      photoPreview: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar troca de senha
      if (formData.newPassword || formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('As senhas não coincidem');
          setIsLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('A nova senha deve ter no mínimo 6 caracteres');
          setIsLoading(false);
          return;
        }
        if (!formData.currentPassword) {
          setError('Digite sua senha atual para alterá-la');
          setIsLoading(false);
          return;
        }
      }

      const token = localStorage.getItem('token');
      
      // ✅ Backend com multer implementado - Usar FormData
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('gender', formData.gender);
      
      // Adicionar foto se houver
      if (formData.photoFile) {
        submitData.append('photo', formData.photoFile);
      }

      // Adicionar senhas se estiver mudando
      if (formData.newPassword) {
        submitData.append('currentPassword', formData.currentPassword);
        submitData.append('newPassword', formData.newPassword);
      }

      const response = await api.put('/users/profile', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Atualizar usuário no localStorage e no contexto
      const updatedUser = response.data.user || response.data;
      updateUser(updatedUser);

      setSuccess('✅ Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      // Atualizar formData com os novos dados
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        gender: updatedUser.gender || 'masculino',
        photoFile: null,
        photoPreview: updatedUser.photoUrl || null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Restaurar dados originais
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || 'masculino',
        photoFile: null,
        photoPreview: user.photoUrl || null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Voltar ao Painel
        </Link>
        <h1 className={styles.pageTitle}>Meu Perfil</h1>
      </div>

      <div className={styles.content}>
        {/* Card Principal */}
        <div className={`card ${styles.profileCard}`}>
          
          {/* Mensagens */}
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">❌ {error}</div>}

          {/* Avatar e Info Básica */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              {formData.photoPreview ? (
                <img 
                  src={formData.photoPreview} 
                  alt={formData.name}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span>{formData.name?.charAt(0)?.toUpperCase() || '👤'}</span>
                </div>
              )}
              
              {isEditing && (
                <div className={styles.avatarActions}>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 {formData.photoPreview ? 'Trocar' : 'Adicionar'} Foto
                  </button>
                  {formData.photoPreview && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={handleRemovePhoto}
                    >
                      🗑️ Remover
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>

            <div className={styles.profileInfo}>
              <h2>{formData.name || 'Sem nome'}</h2>
              <p>{formData.email}</p>
              <span className="badge badge-primary">{formData.gender}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Informações Pessoais */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>📋 Informações Pessoais</h3>
              
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label htmlFor="name">Nome Completo <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gênero</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Alterar Senha */}
            {isEditing && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🔒 Alterar Senha (opcional)</h3>
                
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Digite sua senha atual"
                    />
                    <small className="form-hint">
                      Necessário apenas se quiser trocar a senha
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">Nova Senha</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Digite novamente"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className={styles.actions}>
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => {
                    setIsEditing(true);
                    setSuccess('');
                    setError('');
                  }}
                >
                  ✏️ Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-lg"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    ❌ Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Card de Informações */}
        <div className={`card ${styles.infoCard}`}>
          <h3 className={styles.infoTitle}>ℹ️ Informações</h3>
          <ul className={styles.infoList}>
            <li>📸 Tamanho máximo da foto: 5MB</li>
            <li>🖼️ Formatos aceitos: JPG, PNG, GIF</li>
            <li>🔒 Senha mínima: 6 caracteres</li>
            <li>✉️ Email deve ser único</li>
            <li>💾 Alterações são salvas imediatamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
