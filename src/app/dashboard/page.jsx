'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Dashboard() {
  const [familyData, setFamilyData] = useState({
    name: "Família Silva",
    members: ["João Silva", "Maria Silva", "Pedro Silva", "Ana Silva"]
  });

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      type: "consulta",
      title: "Consulta Pediatra - Pedro",
      date: "2025-09-15",
      time: "14:30",
      location: "Clínica São José"
    },
    {
      id: 2,
      type: "evento",
      title: "Aniversário da Vovó",
      date: "2025-09-18",
      time: "19:00",
      location: "Casa da Família"
    },
    {
      id: 3,
      type: "consulta",
      title: "Dentista - Maria",
      date: "2025-09-20",
      time: "09:00",
      location: "OdontoClinic"
    }
  ]);

  const [recentNotes, setRecentNotes] = useState([
    {
      id: 1,
      title: "Lista de compras",
      content: "Leite, pão, frutas, detergente...",
      author: "Maria Silva",
      date: "2025-09-10"
    },
    {
      id: 2,
      title: "Reunião escolar",
      content: "Reunião na escola do Pedro dia 25/09...",
      author: "João Silva",
      date: "2025-09-09"
    }
  ]);

  const [recentPhotos] = useState([
    { id: 1, src: "/placeholder-photo1.jpg", alt: "Família no parque" },
    { id: 2, src: "/placeholder-photo2.jpg", alt: "Festa de aniversário" },
    { id: 3, src: "/placeholder-photo3.jpg", alt: "Viagem à praia" },
    { id: 4, src: "/placeholder-photo4.jpg", alt: "Jantar em família" }
  ]);

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

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.familyInfo}>
            <h1 className={styles.familyName}>{familyData.name}</h1>
            <p className={styles.memberCount}>{familyData.members.length} membros</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.notificationBtn}>
              🔔
              <span className={styles.notificationBadge}>3</span>
            </button>
            <div className={styles.userMenu}>
              <div className={styles.userAvatar}>JS</div>
            </div>
          </div>
        </div>
      </header>

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
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>Próximos Eventos</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statLabel}>Anotações</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📍</div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>8</span>
                <span className={styles.statLabel}>Lugares</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📸</div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>47</span>
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
                {upcomingEvents.map(event => (
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
                ))}
              </div>
            </div>

            {/* Recent Notes */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Anotações Recentes</h2>
                <Link href="/notes" className={styles.viewAllLink}>Ver todas</Link>
              </div>
              <div className={styles.notesList}>
                {recentNotes.map(note => (
                  <div key={note.id} className={styles.noteItem}>
                    <h3 className={styles.noteTitle}>{note.title}</h3>
                    <p className={styles.noteContent}>{note.content}</p>
                    <div className={styles.noteFooter}>
                      <span className={styles.noteAuthor}>{note.author}</span>
                      <span className={styles.noteDate}>{formatDate(note.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Photos */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Fotos Recentes</h2>
                <Link href="/gallery" className={styles.viewAllLink}>Ver galeria</Link>
              </div>
              <div className={styles.photosGrid}>
                {recentPhotos.map(photo => (
                  <div key={photo.id} className={styles.photoItem}>
                    <div 
                      className={styles.photoPlaceholder}
                      style={{ backgroundColor: 'var(--gray-200)' }}
                    >
                      📷
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Members */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Membros da Família</h2>
                <button className={styles.inviteButton}>+ Convidar</button>
              </div>
              <div className={styles.membersList}>
                {familyData.members.map((member, index) => (
                  <div key={index} className={styles.memberItem}>
                    <div className={styles.memberAvatar}>
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span className={styles.memberName}>{member}</span>
                    <span className={styles.memberStatus}>Online</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
