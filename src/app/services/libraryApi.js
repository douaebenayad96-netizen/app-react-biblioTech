import { apiClient } from './apiClient';

export const libraryApi = {
  // GET /api/livres
  getLivres: (page = 1) => apiClient.get(`/livres?page=${page}`),

  // GET /api/categories
  getCategories: () => apiClient.get('/categories'),

  // GET /api/emprunts
  getEmprunts: () => apiClient.get('/emprunts'),

  // POST /api/livres
  // (format à adapter si besoin, mais on envoie les champs fournis depuis le formulaire)
  createLivre: (payload) => apiClient.post('/livres', payload),

  // POST /api/emprunts
  createEmprunt: ({ livreId, membreId }) => apiClient.post('/emprunts', { livreId, membreId }),

  // PATCH /api/emprunts/{emprunt}/retour
  returnEmprunt: (empruntId) => apiClient.patch(`/emprunts/${empruntId}/retour`, {}),

  // DELETE /api/emprunts/{emprunt}
  deleteEmprunt: (empruntId) => apiClient.delete(`/emprunts/${empruntId}`),
};

