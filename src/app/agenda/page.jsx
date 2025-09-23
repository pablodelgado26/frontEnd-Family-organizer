'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';
import { appointmentService, eventService } from '../../services/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './page.module.css';

function AgendaContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { currentGroup } = useFamily();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('consulta'); // consulta, evento
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: 'consulta',
    title: '',
    date: '',
    time: '',
    location: '',
    doctor: '',
    notes: '',
    description: ''
  });

  // Carregar eventos e consultas
  const loadEvents = async () => {
    if (!currentGroup) return;

    try {
      setLoading(true);
      setError('');

      const [appointmentsResponse, eventsResponse] = await Promise.all([
        appointmentService.getGroupAppointments(currentGroup.id),
        eventService.getGroupEvents(currentGroup.id)
      ]);

      const appointments = appointmentsResponse.data.map(apt => ({
        ...apt,
        type: 'consulta',
        title: apt.title,
        member: apt.member || 'Não especificado'
      }));

      const eventsList = eventsResponse.data.map(evt => ({
        ...evt,
        type: 'evento',
        title: evt.title,
        description: evt.description || ''
      }));

      setEvents([...appointments, ...eventsList]);
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      setError('Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentGroup) {
      loadEvents();
    }
  }, [currentGroup]);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentGroup) return;

    setIsSubmitting(true);
    setError('');

    try {
      if (formData.type === 'consulta') {
        await appointmentService.createAppointment({
          title: formData.title,
          doctor: formData.doctor,
          location: formData.location,
          date: formData.date,
          time: formData.time,
          description: formData.notes,
          familyGroupId: currentGroup.id
        });
      } else {
        await eventService.createEvent({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          type: 'OTHER',
          familyGroupId: currentGroup.id
        });
      }

      // Recarregar eventos
      await loadEvents();
      
      // Resetar form e fechar modal
      setFormData({
        type: 'consulta',
        title: '',
        date: '',
        time: '',
        location: '',
        doctor: '',
        notes: '',
        description: ''
      });
      setShowModal(false);

    } catch (error) {
      console.error('Erro ao criar evento:', error);
      setError(error.response?.data?.message || 'Erro ao criar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({ ...formData, type });
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getEventsByDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Dias do mês anterior
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        events: getEventsByDate(prevDate)
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateObj = new Date(year, month, day);
      days.push({
        date: currentDateObj,
        isCurrentMonth: true,
        events: getEventsByDate(currentDateObj)
      });
    }

    // Completar com dias do próximo mês se necessário
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        events: getEventsByDate(nextDate)
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const calendarDays = generateCalendarDays();
  const todayEvents = events.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.date === today;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>← Voltar ao Painel</Link>
            <h1 className={styles.title}>Agenda Familiar</h1>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => openModal('consulta')} 
              className="btn btn-secondary"
            >
              + Consulta
            </button>
            <button 
              onClick={() => openModal('evento')} 
              className="btn btn-primary"
            >
              + Evento
            </button>
          </div>
        </div>
      </header>

      {/* Loading e Error States */}
      {loading && (
        <div className={styles.loading}>
          Carregando agenda...
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={loadEvents} className={styles.retryBtn}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (

      <div className={styles.agendaLayout}>
        {/* Calendar */}
        <div className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <button onClick={() => navigateMonth(-1)} className={styles.navButton}>‹</button>
            <h2 className={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={() => navigateMonth(1)} className={styles.navButton}>›</button>
          </div>

          <div className={styles.calendar}>
            <div className={styles.weekDaysHeader}>
              {weekDays.map(day => (
                <div key={day} className={styles.weekDay}>{day}</div>
              ))}
            </div>
            
            <div className={styles.calendarGrid}>
              {calendarDays.map((dayInfo, index) => {
                const isToday = dayInfo.date.toDateString() === new Date().toDateString();
                const isSelected = dayInfo.date.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={index}
                    className={`${styles.calendarDay} 
                      ${!dayInfo.isCurrentMonth ? styles.otherMonth : ''} 
                      ${isToday ? styles.today : ''} 
                      ${isSelected ? styles.selected : ''}
                    `}
                    onClick={() => setSelectedDate(dayInfo.date)}
                  >
                    <span className={styles.dayNumber}>{dayInfo.date.getDate()}</span>
                    {dayInfo.events.length > 0 && (
                      <div className={styles.eventIndicator}>
                        {dayInfo.events.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className={styles.eventsSection}>
          <div className={styles.eventsHeader}>
            <h3>Eventos de {formatDate(selectedDate.toISOString())}</h3>
          </div>
          
          <div className={styles.eventsList}>
            {getEventsByDate(selectedDate).length === 0 ? (
              <div className={styles.noEvents}>
                <span className={styles.noEventsIcon}>📅</span>
                <p>Nenhum evento nesta data</p>
                <button onClick={() => openModal('evento')} className="btn btn-primary">
                  Adicionar Evento
                </button>
              </div>
            ) : (
              getEventsByDate(selectedDate).map(event => (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <div className={styles.eventType}>
                      {event.type === 'consulta' ? '🏥' : '🎉'} {event.type}
                    </div>
                    <div className={styles.eventTime}>{event.time}</div>
                  </div>
                  <h4 className={styles.eventTitle}>{event.title}</h4>
                  <p className={styles.eventLocation}>📍 {event.location}</p>
                  
                  {event.type === 'consulta' ? (
                    <div className={styles.consultaDetails}>
                      <p><strong>Médico:</strong> {event.doctor}</p>
                      <p><strong>Paciente:</strong> {event.member}</p>
                      {event.notes && <p><strong>Observações:</strong> {event.notes}</p>}
                    </div>
                  ) : (
                    event.description && (
                      <p className={styles.eventDescription}>{event.description}</p>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {modalType === 'consulta' ? 'Nova Consulta Médica' : 'Novo Evento'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {error && (
                <div className={styles.modalError}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder={modalType === 'consulta' ? 'Ex: Consulta Pediatra - Pedro' : 'Ex: Aniversário da Vovó'}
                />
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="date">Data</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Horário</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Local</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Clínica São José"
                />
              </div>

              {modalType === 'consulta' ? (
                <>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label htmlFor="doctor">Médico</label>
                      <input
                        type="text"
                        id="doctor"
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleInputChange}
                        placeholder="Dr. João Silva"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="member">Paciente</label>
                      <select
                        id="member"
                        name="member"
                        value={formData.member}
                        onChange={handleInputChange}
                      >
                        <option value="">Selecione o paciente</option>
                        <option value="João Silva">João Silva</option>
                        <option value="Maria Silva">Maria Silva</option>
                        <option value="Pedro Silva">Pedro Silva</option>
                        <option value="Ana Silva">Ana Silva</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Observações</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Consulta de rotina, exames necessários, etc."
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Detalhes sobre o evento..."
                  />
                </div>
              )}

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    modalType === 'consulta' ? 'Agendando...' : 'Criando...'
                  ) : (
                    modalType === 'consulta' ? 'Agendar Consulta' : 'Criar Evento'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Agenda() {
  return (
    <ProtectedRoute>
      <AgendaContent />
    </ProtectedRoute>
  );
}
