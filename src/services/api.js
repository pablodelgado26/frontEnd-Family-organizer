import api from '../lib/api';

// ========== GRUPOS FAMILIARES ==========
export const familyGroupService = {
  // Listar meus grupos
  getMyGroups: () => api.get('/family-groups'),
  
  // Criar novo grupo
  createGroup: (data) => api.post('/family-groups', data),
  
  // Entrar em grupo com código
  joinGroup: (inviteCode) => api.post('/family-groups/join', { inviteCode }),
  
  // Ver detalhes do grupo
  getGroupDetails: (groupId) => api.get(`/family-groups/${groupId}`),
  
  // Gerar novo código de convite
  regenerateInvite: (groupId) => api.put(`/family-groups/${groupId}/regenerate-invite`),
};

// ========== CONSULTAS MÉDICAS ==========
export const appointmentService = {
  // Listar consultas do grupo
  getGroupAppointments: (groupId) => api.get(`/appointments/group/${groupId}`),
  
  // Criar nova consulta
  createAppointment: (data) => api.post('/appointments', data),
  
  // Próximas consultas
  getUpcomingAppointments: (groupId) => api.get(`/appointments/group/${groupId}/upcoming`),
  
  // Consultas por data
  getAppointmentsByDate: (groupId, date) => api.get(`/appointments/group/${groupId}/date?date=${date}`),
  
  // Consultas por médico
  getAppointmentsByDoctor: (groupId, doctor) => api.get(`/appointments/group/${groupId}/doctor?doctor=${doctor}`),
  
  // Atualizar consulta
  updateAppointment: (appointmentId, data) => api.put(`/appointments/${appointmentId}`, data),
  
  // Excluir consulta
  deleteAppointment: (appointmentId) => api.delete(`/appointments/${appointmentId}`),
};

// ========== EVENTOS FAMILIARES ==========
export const eventService = {
  // Listar eventos do grupo
  getGroupEvents: (groupId) => api.get(`/events/group/${groupId}`),
  
  // Criar novo evento
  createEvent: (data) => api.post('/events', data),
  
  // Próximos eventos
  getUpcomingEvents: (groupId) => api.get(`/events/group/${groupId}/upcoming`),
  
  // Aniversários do mês
  getBirthdays: (groupId) => api.get(`/events/group/${groupId}/birthdays`),
  
  // Eventos por tipo
  getEventsByType: (groupId, type) => api.get(`/events/group/${groupId}/type?type=${type}`),
  
  // Atualizar evento
  updateEvent: (eventId, data) => api.put(`/events/${eventId}`, data),
  
  // Excluir evento
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
};

// ========== ANOTAÇÕES/RECADOS ==========
export const noteService = {
  // Listar anotações do grupo
  getGroupNotes: (groupId) => api.get(`/notes/group/${groupId}`),
  
  // Criar nova anotação
  createNote: (data) => api.post('/notes', data),
  
  // Anotações por prioridade
  getNotesByPriority: (groupId, priority) => api.get(`/notes/group/${groupId}/priority?priority=${priority}`),
  
  // Buscar anotações
  searchNotes: (groupId, query) => api.get(`/notes/group/${groupId}/search?q=${query}`),
  
  // Anotações de alta prioridade
  getHighPriorityNotes: (groupId) => api.get(`/notes/group/${groupId}/high-priority`),
  
  // Atualizar anotação
  updateNote: (noteId, data) => api.put(`/notes/${noteId}`, data),
  
  // Excluir anotação
  deleteNote: (noteId) => api.delete(`/notes/${noteId}`),
};

// ========== LUGARES IMPORTANTES ==========
export const placeService = {
  // Listar lugares do grupo
  getGroupPlaces: (groupId) => api.get(`/places/group/${groupId}`),
  
  // Criar novo lugar
  createPlace: (data) => api.post('/places', data),
  
  // Lugares por tipo
  getPlacesByType: (groupId, type) => api.get(`/places/group/${groupId}/type?type=${type}`),
  
  // Buscar lugares
  searchPlaces: (groupId, query) => api.get(`/places/group/${groupId}/search?q=${query}`),
  
  // Tipos disponíveis
  getPlaceTypes: (groupId) => api.get(`/places/group/${groupId}/types`),
  
  // Atualizar lugar
  updatePlace: (placeId, data) => api.put(`/places/${placeId}`, data),
  
  // Excluir lugar
  deletePlace: (placeId) => api.delete(`/places/${placeId}`),
};

// ========== ÁLBUNS DE FOTOS ==========
export const albumService = {
  // Listar álbuns do grupo
  getGroupAlbums: (groupId) => api.get(`/albums/group/${groupId}`),
  
  // Criar novo álbum
  createAlbum: (data) => api.post('/albums', data),
  
  // Álbuns recentes
  getRecentAlbums: (groupId) => api.get(`/albums/group/${groupId}/recent`),
  
  // Buscar álbuns
  searchAlbums: (groupId, query) => api.get(`/albums/group/${groupId}/search?q=${query}`),
  
  // Atualizar álbum
  updateAlbum: (albumId, data) => api.put(`/albums/${albumId}`, data),
  
  // Excluir álbum
  deleteAlbum: (albumId) => api.delete(`/albums/${albumId}`),
};

// ========== FOTOS ==========
export const photoService = {
  // Listar fotos do grupo
  getGroupPhotos: (groupId) => api.get(`/photos/group/${groupId}`),
  
  // Criar nova foto
  createPhoto: (data) => api.post('/photos', data),
  
  // Fotos do álbum
  getAlbumPhotos: (albumId) => api.get(`/photos/album/${albumId}`),
  
  // Fotos sem álbum
  getPhotosWithoutAlbum: (groupId) => api.get(`/photos/group/${groupId}/without-album`),
  
  // Mover foto para álbum
  movePhotoToAlbum: (photoId, albumId) => api.put(`/photos/${photoId}/move`, { albumId }),
  
  // Fotos recentes
  getRecentPhotos: (groupId) => api.get(`/photos/group/${groupId}/recent`),
  
  // Atualizar foto
  updatePhoto: (photoId, data) => api.put(`/photos/${photoId}`, data),
  
  // Excluir foto
  deletePhoto: (photoId) => api.delete(`/photos/${photoId}`),
};

// ========== DASHBOARD ==========
export const dashboardService = {
  // Resumo do dashboard
  getDashboardSummary: (groupId) => api.get(`/dashboard/group/${groupId}`),
  
  // Agenda de hoje
  getTodayAgenda: (groupId) => api.get(`/dashboard/group/${groupId}/today`),
  
  // Estatísticas do grupo
  getGroupStats: (groupId) => api.get(`/dashboard/group/${groupId}/stats`),
};