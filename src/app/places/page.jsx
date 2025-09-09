'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Places() {
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: 'Clínica São José',
      category: 'saude',
      address: 'Rua das Flores, 123 - Centro',
      phone: '(11) 1234-5678',
      description: 'Clínica com pediatra e cardiologista. Dr. Carlos é muito atencioso.',
      favorite: true,
      notes: 'Levar carteirinha do plano. Estacionamento gratuito.',
      addedBy: 'Maria Silva',
      date: '2025-09-05'
    },
    {
      id: 2,
      name: 'Supermercado Extra',
      category: 'compras',
      address: 'Av. Principal, 456 - Vila Nova',
      phone: '(11) 2345-6789',
      description: 'Supermercado com bons preços e variedade. Promoções às quintas.',
      favorite: false,
      notes: 'Desconto de 10% para aposentados. Abre domingo até 20h.',
      addedBy: 'João Silva',
      date: '2025-09-03'
    },
    {
      id: 3,
      name: 'Escola Municipal Pedro Álvares',
      category: 'educacao',
      address: 'Rua da Educação, 789 - Jardim Escola',
      phone: '(11) 3456-7890',
      description: 'Escola do Pedro. Diretora Maria José é muito organizada.',
      favorite: true,
      notes: 'Reunião sempre na 3ª quinta do mês às 19h. Portal online disponível.',
      addedBy: 'Maria Silva',
      date: '2025-09-01'
    },
    {
      id: 4,
      name: 'Padaria do Bairro',
      category: 'alimentacao',
      address: 'Rua do Pão, 321 - Nossa Senhora',
      phone: '(11) 4567-8901',
      description: 'Melhor pão francês da região. Abre cedo todos os dias.',
      favorite: false,
      notes: 'Pão sai do forno 6h, 10h, 14h e 18h. Domingo não abre.',
      addedBy: 'Ana Silva',
      date: '2025-08-28'
    },
    {
      id: 5,
      name: 'Farmácia Saúde Total',
      category: 'saude',
      address: 'Praça Central, 654 - Centro',
      phone: '(11) 5678-9012',
      description: 'Farmácia com delivery e bons preços em genéricos.',
      favorite: true,
      notes: '24h. Desconto no programa fidelidade. WhatsApp: (11) 99999-9999.',
      addedBy: 'João Silva',
      date: '2025-08-25'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('name');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'outros',
    address: '',
    phone: '',
    description: '',
    notes: '',
    favorite: false
  });

  const categories = [
    { id: 'todos', name: 'Todos os Lugares', icon: '📍' },
    { id: 'saude', name: 'Saúde', icon: '🏥' },
    { id: 'educacao', name: 'Educação', icon: '🎓' },
    { id: 'compras', name: 'Compras', icon: '🛒' },
    { id: 'alimentacao', name: 'Alimentação', icon: '🍽️' },
    { id: 'lazer', name: 'Lazer', icon: '🎯' },
    { id: 'servicos', name: 'Serviços', icon: '🔧' },
    { id: 'transporte', name: 'Transporte', icon: '🚗' },
    { id: 'outros', name: 'Outros', icon: '📄' }
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
    
    if (editingPlace) {
      setPlaces(prev => prev.map(place =>
        place.id === editingPlace.id
          ? {
              ...place,
              ...formData,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : place
      ));
    } else {
      const newPlace = {
        id: Date.now(),
        ...formData,
        addedBy: 'Usuário Atual',
        date: new Date().toISOString().split('T')[0]
      };
      setPlaces(prev => [newPlace, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'outros',
      address: '',
      phone: '',
      description: '',
      notes: '',
      favorite: false
    });
    setEditingPlace(null);
    setShowModal(false);
  };

  const editPlace = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      category: place.category,
      address: place.address,
      phone: place.phone,
      description: place.description,
      notes: place.notes,
      favorite: place.favorite
    });
    setShowModal(true);
  };

  const deletePlace = (placeId) => {
    if (confirm('Tem certeza que deseja excluir este lugar?')) {
      setPlaces(prev => prev.filter(place => place.id !== placeId));
    }
  };

  const toggleFavorite = (placeId) => {
    setPlaces(prev => prev.map(place =>
      place.id === placeId ? { ...place, favorite: !place.favorite } : place
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : '📄';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Outros';
  };

  const openMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const callPhone = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const filteredPlaces = places
    .filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           place.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           place.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || place.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || place.favorite;
      return matchesSearch && matchesCategory && matchesFavorites;
    })
    .sort((a, b) => {
      // Favoritos sempre primeiro se não estiver filtrando só favoritos
      if (!showFavoritesOnly) {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
      }
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
          return new Date(b.date) - new Date(a.date);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>← Voltar ao Painel</Link>
            <h1 className={styles.title}>Lugares Importantes</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn btn-primary"
          >
            + Adicionar Lugar
          </button>
        </div>
      </header>

      <div className={styles.placesLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Pesquisar lugares..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filtersSection}>
            <h3>Filtros</h3>
            <label className={styles.favoriteFilter}>
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              />
              <span>⭐ Apenas favoritos</span>
            </label>
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
                    {category.id === 'todos' 
                      ? places.length 
                      : places.filter(place => place.category === category.id).length
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
              <option value="name">Nome</option>
              <option value="category">Categoria</option>
              <option value="date">Data de adição</option>
            </select>
          </div>
        </aside>

        {/* Places Main */}
        <main className={styles.placesMain}>
          <div className={styles.placesHeader}>
            <h2>
              {selectedCategory === 'todos' ? 'Todos os lugares' : getCategoryName(selectedCategory)}
              {showFavoritesOnly && ' (Favoritos)'}
              <span className={styles.placesCount}>({filteredPlaces.length})</span>
            </h2>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📍</span>
              <h3>Nenhum lugar encontrado</h3>
              <p>
                {searchTerm ? 
                  'Tente usar outras palavras-chave.' : 
                  'Comece adicionando lugares importantes para sua família!'
                }
              </p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">
                + Adicionar Lugar
              </button>
            </div>
          ) : (
            <div className={styles.placesList}>
              {filteredPlaces.map(place => (
                <div key={place.id} className={styles.placeCard}>
                  <div className={styles.placeHeader}>
                    <div className={styles.placeCategory}>
                      <span className={styles.categoryIconSmall}>
                        {getCategoryIcon(place.category)}
                      </span>
                      <span>{getCategoryName(place.category)}</span>
                    </div>
                    <div className={styles.placeActions}>
                      <button
                        onClick={() => toggleFavorite(place.id)}
                        className={`${styles.favoriteButton} ${place.favorite ? styles.favorited : ''}`}
                        title={place.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        ⭐
                      </button>
                      <button
                        onClick={() => editPlace(place)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deletePlace(place.id)}
                        className={styles.deleteButton}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className={styles.placeInfo}>
                    <h3 className={styles.placeName}>{place.name}</h3>
                    <p className={styles.placeDescription}>{place.description}</p>
                    
                    <div className={styles.placeDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailIcon}>📍</span>
                        <span className={styles.detailText}>
                          {place.address}
                          <button 
                            onClick={() => openMaps(place.address)}
                            className={styles.mapButton}
                            title="Abrir no Google Maps"
                          >
                            🗺️ Ver no mapa
                          </button>
                        </span>
                      </div>
                      
                      {place.phone && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>📞</span>
                          <span className={styles.detailText}>
                            {place.phone}
                            <button 
                              onClick={() => callPhone(place.phone)}
                              className={styles.callButton}
                              title="Ligar"
                            >
                              📱 Ligar
                            </button>
                          </span>
                        </div>
                      )}
                    </div>

                    {place.notes && (
                      <div className={styles.placeNotes}>
                        <strong>Observações:</strong>
                        <p>{place.notes}</p>
                      </div>
                    )}

                    <div className={styles.placeFooter}>
                      <span>Adicionado por {place.addedBy}</span>
                      <span>{formatDate(place.date)}</span>
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
              <h3>{editingPlace ? 'Editar Lugar' : 'Adicionar Novo Lugar'}</h3>
              <button onClick={resetForm} className={styles.closeButton}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label htmlFor="name">Nome do lugar</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Clínica São José"
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
                <label htmlFor="address">Endereço</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telefone (opcional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 1234-5678"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Breve descrição sobre o lugar..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Observações (opcional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Horários, preços, dicas importantes..."
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="favorite"
                    checked={formData.favorite}
                    onChange={handleInputChange}
                  />
                  <span>⭐ Marcar como favorito</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlace ? 'Salvar Alterações' : 'Adicionar Lugar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
