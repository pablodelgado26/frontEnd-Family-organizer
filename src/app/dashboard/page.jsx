'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';
import { dashboardService, appointmentService, eventService, noteService, photoService } from '../../services/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './page.module.css';

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currentGroup, groups, switchGroup } = useFamily();
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    todayAgenda: null,
    stats: null
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar dados do dashboard
  const loadDashboardData = async () => {
    if (!currentGroup) return;

    try {
      setLoading(true);
      setError('');

      // Carregar dados em paralelo
      const [summaryResponse, todayResponse, statsResponse, upcomingAppts, upcomingEvts, notesResponse, photosResponse] = await Promise.all([
        dashboardService.getDashboardSummary(currentGroup.id).catch(() => null),
        dashboardService.getTodayAgenda(currentGroup.id).catch(() => null),
        dashboardService.getGroupStats(currentGroup.id).catch(() => null),
        appointmentService.getUpcomingAppointments(currentGroup.id).catch(() => ({ data: [] })),
        eventService.getUpcomingEvents(currentGroup.id).catch(() => ({ data: [] })),
        noteService.getGroupNotes(currentGroup.id).catch(() => ({ data: [] })),
        photoService.getRecentPhotos(currentGroup.id).catch(() => ({ data: [] }))
      ]);

      setDashboardData({
        summary: summaryResponse?.data || null,
        todayAgenda: todayResponse?.data || null,
        stats: statsResponse?.data || null
      });

      // Combinar consultas e eventos próximos
      const appointments = upcomingAppts.data || [];
      const events = upcomingEvts.data || [];
      
      const combinedEvents = [
        ...appointments.map(apt => ({
          ...apt,
          type: 'consulta',
          title: `${apt.title} - ${apt.doctor}`,
          location: apt.location
        })),
        ...events.map(evt => ({
          ...evt,
          type: 'evento',
          title: evt.title,
          location: evt.location || 'Local não informado'
        }))
      ].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

      setUpcomingEvents(combinedEvents.slice(0, 5));
      setRecentNotes(notesResponse.data?.slice(0, 3) || []);
      setRecentPhotos(photosResponse.data?.slice(0, 4) || []);

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentGroup) {
      loadDashboardData();
    }
  }, [currentGroup]);

  // Redirecionar se não há grupos
  useEffect(() => {
    if (!loading && groups.length === 0 && currentGroup === null) {
      router.push('/family/create');
    }
  }, [groups, currentGroup, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getEventTypeIcon = (type) => {
    return type === 'consulta' ? '🏥' : '🎉';
  };

  const getEventTypeColor = (type) => {
    return type === 'consulta' ? 'var(--error)' : 'var(--success)';
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Carregando dashboard...
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className={styles.loading}>
        Configurando seu grupo familiar...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.familyInfo}>
            <h1 className={styles.familyName}>{currentGroup?.name || 'Minha Família'}</h1>
            <p className={styles.memberCount}>{currentGroup?.members?.length || 0} membros</p>
            {groups.length > 1 && (
              <select 
                className={styles.groupSelector}
                value={currentGroup?.id || ''}
                onChange={(e) => {
                  const selectedGroup = groups.find(g => g.id.toString() === e.target.value);
                  if (selectedGroup) switchGroup(selectedGroup);
                }}
              >
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className={styles.headerActions}>
            <span className={styles.welcomeText}>
              Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
            </span>
            <div className={styles.userMenu}>
              <div className={styles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className={styles.userDropdown}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={loadDashboardData} className={styles.retryBtn}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.navigation}>
        <Link href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
          🏠 Painel
        </Link>
        <Link href="/agenda" className={styles.navItem}>
          📅 Agenda
        </Link>
        <Link href="/notes" className={styles.navItem}>
          📝 Anotações
        </Link>
        <Link href="/places" className={styles.navItem}>
          📍 Lugares
        </Link>
        <Link href="/gallery" className={styles.navItem}>
          📸 Galeria
        </Link>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {/* Quick Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {dashboardData.stats?.upcomingAppointments || upcomingEvents.length}
                </span>
                <span className={styles.statLabel}>Próximos Eventos</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {dashboardData.stats?.totalNotes || recentNotes.length}
                </span>
                <span className={styles.statLabel}>Anotações</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📍</div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {dashboardData.stats?.totalPlaces || 0}
                </span>
                <span className={styles.statLabel}>Lugares</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📸</div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {dashboardData.stats?.totalPhotos || recentPhotos.length}
                </span>
                <span className={styles.statLabel}>Fotos</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className={styles.contentGrid}>
            {/* Upcoming Events */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Próximos Compromissos</h2>
                <Link href="/agenda" className={styles.viewAllLink}>Ver todos</Link>
              </div>
              <div className={styles.eventsList}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div key={event.id} className={styles.eventItem}>
                      <div className={styles.eventIcon}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className={styles.eventInfo}>
                        <h3 className={styles.eventTitle}>{event.title}</h3>
                        <p className={styles.eventDetails}>
                          {formatDate(event.date)} às {event.time}
                        </p>
                        <p className={styles.eventLocation}>{event.location}</p>
                      </div>
                      <div 
                        className={styles.eventType}
                        style={{ backgroundColor: getEventTypeColor(event.type) }}
                      >
                        {event.type}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>Nenhum compromisso próximo</p>
                    <Link href="/agenda" className={styles.addButton}>
                      + Adicionar compromisso
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Notes */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Anotações Recentes</h2>
                <Link href="/notes" className={styles.viewAllLink}>Ver todas</Link>
              </div>
              <div className={styles.notesList}>
                {recentNotes.length > 0 ? (
                  recentNotes.map(note => (
                    <div key={note.id} className={styles.noteItem}>
                      <h3 className={styles.noteTitle}>{note.title}</h3>
                      <p className={styles.noteContent}>
                        {note.content?.substring(0, 100)}
                        {note.content?.length > 100 ? '...' : ''}
                      </p>
                      <div className={styles.noteFooter}>
                        <span className={styles.notePriority}>{note.priority || 'NORMAL'}</span>
                        <span className={styles.noteDate}>
                          {formatDate(note.createdAt || note.date)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>Nenhuma anotação recente</p>
                    <Link href="/notes" className={styles.addButton}>
                      + Criar anotação
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Photos */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Fotos Recentes</h2>
                <Link href="/gallery" className={styles.viewAllLink}>Ver galeria</Link>
              </div>
              <div className={styles.photosGrid}>
                {recentPhotos.length > 0 ? (
                  recentPhotos.map(photo => (
                    <div key={photo.id} className={styles.photoItem}>
                      <div 
                        className={styles.photoPlaceholder}
                        style={{ 
                          backgroundImage: photo.imageUrl ? `url(${photo.imageUrl})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: photo.imageUrl ? 'transparent' : 'var(--gray-200)'
                        }}
                      >
                        {!photo.imageUrl && '📷'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>Nenhuma foto recente</p>
                    <Link href="/gallery" className={styles.addButton}>
                      + Adicionar fotos
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Family Members */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Membros da Família</h2>
                <button 
                  className={styles.inviteButton}
                  onClick={() => {
                    navigator.clipboard.writeText(currentGroup?.inviteCode || '');
                    alert(`Código de convite copiado: ${currentGroup?.inviteCode}`);
                  }}
                >
                  Compartilhar código: {currentGroup?.inviteCode}
                </button>
              </div>
              <div className={styles.membersList}>
                {currentGroup?.members?.length > 0 ? (
                  currentGroup.members.map((member, index) => (
                    <div key={index} className={styles.memberItem}>
                      <div className={styles.memberAvatar}>
                        {member.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.memberStatus}>
                        {member.role === 'ADMIN' ? 'Administrador' : 'Membro'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>Carregando membros...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
