'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useFamily } from '@/contexts/FamilyContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './page.module.css';

function NotesContent() {
  const router = useRouter();
  const { selectedFamily, loading: familyLoading } = useFamily();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('date');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'geral',
    pinned: false
  });

  // Redirecionar se não há família selecionada
  useEffect(() => {
    if (!familyLoading && !selectedFamily) {
      alert('Você precisa criar ou entrar em uma família primeiro');
      router.push('/family/create');
    }
  }, [selectedFamily, familyLoading, router]);

  // Buscar notas do backend
  useEffect(() => {
    if (selectedFamily) {
      fetchNotes();
    }
  }, [selectedFamily]);

  const fetchNotes = async () => {
    if (!selectedFamily) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:4000/notes/group/${selectedFamily.id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setNotes(response.data.notes || response.data || []);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      alert('Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'todas', name: 'Todas', icon: '📝' },
    { id: 'geral', name: 'Geral', icon: '📄' },
    { id: 'compras', name: 'Compras', icon: '🛒' },
    { id: 'escola', name: 'Escola', icon: '🎓' },
    { id: 'saude', name: 'Saúde', icon: '🏥' },
    { id: 'trabalho', name: 'Trabalho', icon: '💼' },
    { id: 'financas', name: 'Finanças', icon: '💰' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFamily) {
      alert('Você precisa fazer parte de um grupo familiar');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingNote) {
        // Atualizar nota existente
        await axios.put(`http://localhost:4000/notes/${editingNote.id}`, 
          {
            title: formData.title,
            content: formData.content,
            priority: formData.pinned ? 'alta' : 'normal',
            category: formData.category
          },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        alert('Nota atualizada com sucesso!');
      } else {
        // Criar nova nota
        await axios.post('http://localhost:4000/notes', 
          {
            title: formData.title,
            content: formData.content,
            priority: formData.pinned ? 'alta' : 'normal',
            category: formData.category,
            familyGroupId: selectedFamily.id
          },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        alert('Nota criada com sucesso!');
      }

      await fetchNotes(); // Recarregar notas
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      alert(error.response?.data?.error || 'Erro ao salvar nota');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'geral',
      pinned: false
    });
    setEditingNote(null);
    setShowModal(false);
  };

  const editNote = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category || 'geral',
      pinned: note.priority === 'alta'
    });
    setShowModal(true);
  };

  const deleteNote = async (noteId) => {
    if (confirm('Tem certeza que deseja excluir esta anotação?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/notes/${noteId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Nota excluída com sucesso!');
        await fetchNotes();
      } catch (error) {
        console.error('Erro ao excluir nota:', error);
        alert('Erro ao excluir nota');
      }
    }
  };

  const togglePin = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      const note = notes.find(n => n.id === noteId);
      
      // Alternar entre alta e normal
      const newPriority = note.priority === 'alta' ? 'normal' : 'alta';
      
      await axios.put(`http://localhost:4000/notes/${noteId}`, 
        { 
          title: note.title,
          content: note.content,
          category: note.category,
          priority: newPriority
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      await fetchNotes();
    } catch (error) {
      console.error('Erro ao fixar/desafixar nota:', error);
      alert('Erro ao atualizar nota');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há menos de 1 hora';
    if (diffInHours < 24) return `Há ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `Há ${diffInDays} dias`;
    
    return formatDate(dateString);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : '📄';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Geral';
  };

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todas' || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Prioridade alta sempre no topo
      if (a.priority === 'alta' && b.priority !== 'alta') return -1;
      if (a.priority !== 'alta' && b.priority === 'alta') return 1;
      
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          const authorA = typeof a.author === 'object' ? a.author?.name || '' : a.author || '';
          const authorB = typeof b.author === 'object' ? b.author?.name || '' : b.author || '';
          return authorA.localeCompare(authorB);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (loading || familyLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!selectedFamily) {
    return <div className={styles.loading}>Carregando família...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>← Voltar ao Painel</Link>
            <h1 className={styles.title}>Anotações da Família</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn btn-primary"
          >
            + Nova Anotação
          </button>
        </div>
      </header>

      <div className={styles.notesLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Pesquisar anotações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.categoriesSection}>
            <h3>Categorias</h3>
            <div className={styles.categoriesList}>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`${styles.categoryButton} ${
                    selectedCategory === category.id ? styles.active : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span>{category.name}</span>
                  <span className={styles.categoryCount}>
                    {category.id === 'todas' 
                      ? notes.length 
                      : notes.filter(note => note.category === category.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sortSection}>
            <h3>Ordenar por</h3>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="date">Data</option>
              <option value="title">Título</option>
              <option value="author">Autor</option>
            </select>
          </div>
        </aside>

        {/* Notes Grid */}
        <main className={styles.notesMain}>
          <div className={styles.notesHeader}>
            <h2>
              {selectedCategory === 'todas' ? 'Todas as anotações' : getCategoryName(selectedCategory)}
              <span className={styles.notesCount}>({filteredNotes.length})</span>
            </h2>
          </div>

          {filteredNotes.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📝</span>
              <h3>Nenhuma anotação encontrada</h3>
              <p>
                {searchTerm ? 
                  'Tente usar outras palavras-chave.' : 
                  'Comece criando sua primeira anotação familiar!'
                }
              </p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">
                + Criar Anotação
              </button>
            </div>
          ) : (
            <div className={styles.notesGrid}>
              {filteredNotes.map(note => (
                <div key={note.id} className={styles.noteCard}>
                  <div className={styles.noteHeader}>
                    <div className={styles.noteCategory}>
                      <span className={styles.categoryIconSmall}>
                        {getCategoryIcon(note.category)}
                      </span>
                      <span>{getCategoryName(note.category)}</span>
                    </div>
                    <div className={styles.noteActions}>
                      <button
                        onClick={() => togglePin(note.id)}
                        className={`${styles.pinButton} ${note.priority === 'alta' ? styles.pinned : ''}`}
                        title={note.priority === 'alta' ? 'Desafixar' : 'Fixar'}
                      >
                        📌
                      </button>
                      <button
                        onClick={() => editNote(note)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className={styles.deleteButton}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className={styles.noteTitle}>{note.title}</h3>
                  <p className={styles.noteContent}>{note.content}</p>
                  
                  <div className={styles.noteFooter}>
                    <div className={styles.noteAuthor}>
                      <span>Por {typeof note.author === 'object' ? note.author?.name : note.author || 'Desconhecido'}</span>
                    </div>
                    <div className={styles.noteDate}>
                      {formatRelativeDate(note.createdAt || note.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => resetForm()}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingNote ? 'Editar Anotação' : 'Nova Anotação'}</h3>
              <button onClick={resetForm} className={styles.closeButton}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label htmlFor="title">Título</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite o título da anotação"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Categoria</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="content">Conteúdo</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  placeholder="Escreva sua anotação aqui..."
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="pinned"
                    checked={formData.pinned}
                    onChange={handleInputChange}
                  />
                  <span>📌 Fixar anotação (aparece no topo)</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNote ? 'Salvar Alterações' : 'Criar Anotação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Notes() {
  return (
    <ProtectedRoute>
      <NotesContent />
    </ProtectedRoute>
  );
}
