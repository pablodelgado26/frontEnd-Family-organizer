'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Gallery() {
  const [albums, setAlbums] = useState([
    {
      id: 1,
      name: 'Férias na Praia 2025',
      description: 'Nossa viagem incrível para o litoral em janeiro',
      cover: '/placeholder-beach.jpg',
      photoCount: 24,
      createdBy: 'Maria Silva',
      createdDate: '2025-01-15',
      photos: [
        { id: 1, src: '/placeholder-photo1.jpg', title: 'Pôr do sol na praia', date: '2025-01-15' },
        { id: 2, src: '/placeholder-photo2.jpg', title: 'Família na areia', date: '2025-01-16' },
        { id: 3, src: '/placeholder-photo3.jpg', title: 'Pedro no mar', date: '2025-01-17' }
      ]
    },
    {
      id: 2,
      name: 'Aniversário Pedro - 8 anos',
      description: 'Festa de aniversário do nosso pequeno',
      cover: '/placeholder-birthday.jpg',
      photoCount: 18,
      createdBy: 'João Silva',
      createdDate: '2025-08-20',
      photos: [
        { id: 4, src: '/placeholder-photo4.jpg', title: 'Pedro soprando velas', date: '2025-08-20' },
        { id: 5, src: '/placeholder-photo5.jpg', title: 'Família cantando parabéns', date: '2025-08-20' }
      ]
    },
    {
      id: 3,
      name: 'Casa Nova',
      description: 'Momentos especiais da nossa casa nova',
      cover: '/placeholder-house.jpg',
      photoCount: 12,
      createdBy: 'Ana Silva',
      createdDate: '2025-06-10',
      photos: [
        { id: 6, src: '/placeholder-photo6.jpg', title: 'Sala decorada', date: '2025-06-10' },
        { id: 7, src: '/placeholder-photo7.jpg', title: 'Jardim florido', date: '2025-06-15' }
      ]
    }
  ]);

  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const [albumFormData, setAlbumFormData] = useState({
    name: '',
    description: ''
  });

  const [photoFormData, setPhotoFormData] = useState({
    title: '',
    file: null
  });

  const handleAlbumInputChange = (e) => {
    setAlbumFormData({
      ...albumFormData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoInputChange = (e) => {
    const { name, value, files } = e.target;
    setPhotoFormData({
      ...photoFormData,
      [name]: files ? files[0] : value
    });
  };

  const handleCreateAlbum = (e) => {
    e.preventDefault();
    
    if (editingAlbum) {
      setAlbums(prev => prev.map(album =>
        album.id === editingAlbum.id
          ? { ...album, ...albumFormData }
          : album
      ));
    } else {
      const newAlbum = {
        id: Date.now(),
        name: albumFormData.name,
        description: albumFormData.description,
        cover: '/placeholder-default.jpg',
        photoCount: 0,
        createdBy: 'Usuário Atual',
        createdDate: new Date().toISOString().split('T')[0],
        photos: []
      };
      setAlbums(prev => [newAlbum, ...prev]);
    }

    resetAlbumForm();
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    
    if (!selectedAlbum || !photoFormData.file) return;

    const newPhoto = {
      id: Date.now(),
      src: URL.createObjectURL(photoFormData.file), // Em produção seria o URL do backend
      title: photoFormData.title || photoFormData.file.name,
      date: new Date().toISOString().split('T')[0]
    };

    setAlbums(prev => prev.map(album =>
      album.id === selectedAlbum.id
        ? {
            ...album,
            photos: [newPhoto, ...album.photos],
            photoCount: album.photoCount + 1
          }
        : album
    ));

    setSelectedAlbum(prev => ({
      ...prev,
      photos: [newPhoto, ...prev.photos],
      photoCount: prev.photoCount + 1
    }));

    resetPhotoForm();
  };

  const resetAlbumForm = () => {
    setAlbumFormData({ name: '', description: '' });
    setEditingAlbum(null);
    setShowAlbumModal(false);
  };

  const resetPhotoForm = () => {
    setPhotoFormData({ title: '', file: null });
    setShowPhotoModal(false);
  };

  const editAlbum = (album) => {
    setEditingAlbum(album);
    setAlbumFormData({
      name: album.name,
      description: album.description
    });
    setShowAlbumModal(true);
  };

  const deleteAlbum = (albumId) => {
    if (confirm('Tem certeza que deseja excluir este álbum? Todas as fotos serão perdidas.')) {
      setAlbums(prev => prev.filter(album => album.id !== albumId));
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null);
      }
    }
  };

  const deletePhoto = (photoId) => {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
      setAlbums(prev => prev.map(album =>
        album.id === selectedAlbum.id
          ? {
              ...album,
              photos: album.photos.filter(photo => photo.id !== photoId),
              photoCount: album.photoCount - 1
            }
          : album
      ));

      setSelectedAlbum(prev => ({
        ...prev,
        photos: prev.photos.filter(photo => photo.id !== photoId),
        photoCount: prev.photoCount - 1
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const openPhotoViewer = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
  };

  const totalPhotos = albums.reduce((sum, album) => sum + album.photoCount, 0);

  if (selectedAlbum) {
    return (
      <div className={styles.container}>
        {/* Album Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <button 
                onClick={() => setSelectedAlbum(null)} 
                className={styles.backLink}
              >
                ← Voltar aos álbuns
              </button>
              <h1 className={styles.title}>{selectedAlbum.name}</h1>
              <p className={styles.albumDescription}>{selectedAlbum.description}</p>
              <div className={styles.albumMeta}>
                <span>{selectedAlbum.photoCount} fotos</span>
                <span>•</span>
                <span>Criado por {selectedAlbum.createdBy}</span>
                <span>•</span>
                <span>{formatDate(selectedAlbum.createdDate)}</span>
              </div>
            </div>
            <div className={styles.albumActions}>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="btn btn-primary"
              >
                + Adicionar Fotos
              </button>
              <button
                onClick={() => editAlbum(selectedAlbum)}
                className="btn btn-secondary"
              >
                ✏️ Editar Álbum
              </button>
            </div>
          </div>
        </header>

        {/* Photos Grid */}
        <main className={styles.photosMain}>
          {selectedAlbum.photos.length === 0 ? (
            <div className={styles.emptyPhotos}>
              <span className={styles.emptyIcon}>📷</span>
              <h3>Nenhuma foto neste álbum</h3>
              <p>Adicione suas primeiras fotos para começar!</p>
              <button onClick={() => setShowPhotoModal(true)} className="btn btn-primary">
                + Adicionar Fotos
              </button>
            </div>
          ) : (
            <div className={styles.photosGrid}>
              {selectedAlbum.photos.map(photo => (
                <div key={photo.id} className={styles.photoItem}>
                  <div 
                    className={styles.photoThumbnail}
                    onClick={() => openPhotoViewer(photo)}
                  >
                    <div className={styles.photoPlaceholder}>📷</div>
                    <div className={styles.photoOverlay}>
                      <button className={styles.viewButton}>👁️</button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto(photo.id);
                        }}
                        className={styles.deletePhotoButton}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className={styles.photoInfo}>
                    <h4>{photo.title}</h4>
                    <span>{formatDate(photo.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Add Photo Modal */}
        {showPhotoModal && (
          <div className={styles.modalOverlay} onClick={() => resetPhotoForm()}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Adicionar Fotos ao Álbum</h3>
                <button onClick={resetPhotoForm} className={styles.closeButton}>×</button>
              </div>

              <form onSubmit={handleAddPhoto} className={styles.modalForm}>
                <div className="form-group">
                  <label htmlFor="file">Escolher arquivo</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    onChange={handlePhotoInputChange}
                    required
                  />
                  <small>Formatos aceitos: JPG, PNG, GIF (máximo 10MB)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Título da foto (opcional)</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={photoFormData.title}
                    onChange={handlePhotoInputChange}
                    placeholder="Digite um título para a foto"
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" onClick={resetPhotoForm} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Adicionar Foto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>← Voltar ao Painel</Link>
            <h1 className={styles.title}>Galeria da Família</h1>
            <p className={styles.subtitle}>
              {albums.length} álbuns • {totalPhotos} fotos
            </p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
            </div>
            <button 
              onClick={() => setShowAlbumModal(true)} 
              className="btn btn-primary"
            >
              + Novo Álbum
            </button>
          </div>
        </div>
      </header>

      {/* Albums Grid/List */}
      <main className={styles.albumsMain}>
        {albums.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📸</span>
            <h3>Nenhum álbum criado</h3>
            <p>Crie seu primeiro álbum para organizar as fotos da família!</p>
            <button onClick={() => setShowAlbumModal(true)} className="btn btn-primary">
              + Criar Primeiro Álbum
            </button>
          </div>
        ) : (
          <div className={`${styles.albumsContainer} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
            {albums.map(album => (
              <div 
                key={album.id} 
                className={styles.albumCard}
                onClick={() => setSelectedAlbum(album)}
              >
                <div className={styles.albumCover}>
                  <div className={styles.albumCoverPlaceholder}>📸</div>
                  <div className={styles.albumOverlay}>
                    <div className={styles.albumActions}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editAlbum(album);
                        }}
                        className={styles.editAlbumButton}
                        title="Editar álbum"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAlbum(album.id);
                        }}
                        className={styles.deleteAlbumButton}
                        title="Excluir álbum"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className={styles.photoCount}>
                      {album.photoCount} fotos
                    </div>
                  </div>
                </div>
                
                <div className={styles.albumInfo}>
                  <h3 className={styles.albumName}>{album.name}</h3>
                  <p className={styles.albumDesc}>{album.description}</p>
                  <div className={styles.albumMeta}>
                    <span>Por {album.createdBy}</span>
                    <span>{formatDate(album.createdDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Album Modal */}
      {showAlbumModal && (
        <div className={styles.modalOverlay} onClick={() => resetAlbumForm()}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingAlbum ? 'Editar Álbum' : 'Novo Álbum'}</h3>
              <button onClick={resetAlbumForm} className={styles.closeButton}>×</button>
            </div>

            <form onSubmit={handleCreateAlbum} className={styles.modalForm}>
              <div className="form-group">
                <label htmlFor="name">Nome do álbum</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={albumFormData.name}
                  onChange={handleAlbumInputChange}
                  required
                  placeholder="Ex: Férias na Praia 2025"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={albumFormData.description}
                  onChange={handleAlbumInputChange}
                  rows={3}
                  placeholder="Breve descrição sobre este álbum..."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={resetAlbumForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAlbum ? 'Salvar Alterações' : 'Criar Álbum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className={styles.photoViewerOverlay} onClick={closePhotoViewer}>
          <div className={styles.photoViewer} onClick={e => e.stopPropagation()}>
            <button onClick={closePhotoViewer} className={styles.closeViewer}>×</button>
            <div className={styles.photoViewerContent}>
              <div className={styles.photoViewerImage}>📷</div>
              <div className={styles.photoViewerInfo}>
                <h3>{selectedPhoto.title}</h3>
                <p>{formatDate(selectedPhoto.date)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
