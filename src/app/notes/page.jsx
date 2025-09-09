'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Notes() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Lista de compras da semana',
      content: 'Leite, pão, frutas (maçã, banana), detergente, papel higiênico, frango, arroz, feijão, óleo.',
      author: 'Maria Silva',
      date: '2025-09-10T10:30:00',
      category: 'compras',
      pinned: true
    },
    {
      id: 2,
      title: 'Reunião escolar - Pedro',
      content: 'Reunião na escola do Pedro dia 25/09 às 19h. Assuntos: apresentação do trimestre, eventos do mês, projeto de ciências.',
      author: 'João Silva',
      date: '2025-09-09T15:45:00',
      category: 'escola',
      pinned: false
    },
    {
      id: 3,
      title: 'Receita do bolo da vovó',
      content: '3 ovos, 2 xícaras de açúcar, 1 xícara de óleo, 3 xícaras de farinha, 1 colher de fermento. Misturar tudo e assar por 40min a 180°C.',
      author: 'Ana Silva',
      date: '2025-09-08T20:15:00',
      category: 'receitas',
      pinned: false
    },
    {
      id: 4,
      title: 'Medicamentos da família',
      content: 'João - Losartana (manhã), Maria - Vitamina D (3x semana), Pedro - não toma nada, Ana - Complexo B (diário)',
      author: 'Maria Silva',
      date: '2025-09-07T08:00:00',
      category: 'saude',
      pinned: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('date'); // date, title, author

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'geral',
    pinned: false
  });

  const categories = [
    { id: 'todas', name: 'Todas', icon: '📝' },
    { id: 'geral', name: 'Geral', icon: '📄' },
    { id: 'compras', name: 'Compras', icon: '🛒' },
    { id: 'escola', name: 'Escola', icon: '🎓' },
    { id: 'saude', name: 'Saúde', icon: '🏥' },
    { id: 'receitas', name: 'Receitas', icon: '👩‍🍳' },
    { id: 'tarefas', name: 'Tarefas', icon: '✅' },
    { id: 'financas', name: 'Finanças', icon: '💰' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingNote) {
      setNotes(prev => prev.map(note =>
        note.id === editingNote.id
          ? {
              ...note,
              title: formData.title,
              content: formData.content,
              category: formData.category,
              pinned: formData.pinned,
              updatedAt: new Date().toISOString()
            }
          : note
      ));
    } else {
      const newNote = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        author: 'Usuário Atual', // Seria pego do contexto de autenticação
        date: new Date().toISOString(),
        category: formData.category,
        pinned: formData.pinned
      };
      setNotes(prev => [newNote, ...prev]);
    }

    resetForm();
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
      category: note.category,
      pinned: note.pinned
    });
    setShowModal(true);
  };

  const deleteNote = (noteId) => {
    if (confirm('Tem certeza que deseja excluir esta anotação?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const togglePin = (noteId) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    ));
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
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

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
                        className={`${styles.pinButton} ${note.pinned ? styles.pinned : ''}`}
                        title={note.pinned ? 'Desafixar' : 'Fixar'}
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
                      <span>Por {note.author}</span>
                    </div>
                    <div className={styles.noteDate}>
                      {formatRelativeDate(note.date)}
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
