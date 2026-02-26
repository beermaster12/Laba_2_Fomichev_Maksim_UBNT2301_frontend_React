import api from './axios';

export const medicineService = {
getAll: (params = {}) => api.get('/medicines/', { params }),
getById: (id) => api.get(`/medicines/${id}`),
create: (data) => api.post('/medicines/', data),
update: (id, data) => api.put(`/medicines/${id}`, data),
delete: (id) => api.delete(`/medicines/${id}`),
getStats: {
    count: () => api.get('/stats/count'),
    averagePrice: () => api.get('/stats/average-price'),
},
};