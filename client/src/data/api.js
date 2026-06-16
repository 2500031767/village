import axios from 'axios';

const api = axios.create({
  baseURL: '' // empty base URL so requests go through the Vite dev server proxy or relative path
});

// Request interceptor to append JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    if (res.data.token) {
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  },
  verifyToken: async () => {
    try {
      const res = await api.get('/api/auth/verify');
      return res.data.user;
    } catch (err) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      throw err;
    }
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  }
};

export const businessesAPI = {
  getAll: async () => {
    const res = await api.get('/api/businesses');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/businesses', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/businesses/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/businesses/${id}`);
    return res.data;
  }
};

export const notificationsAPI = {
  getAll: async () => {
    const res = await api.get('/api/notifications');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/notifications', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/notifications/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/notifications/${id}`);
    return res.data;
  }
};

export const galleryAPI = {
  getAll: async () => {
    const res = await api.get('/api/gallery');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/gallery', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/gallery/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/gallery/${id}`);
    return res.data;
  }
};

export const schemesAPI = {
  getAll: async () => {
    const res = await api.get('/api/schemes');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/schemes', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/schemes/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/schemes/${id}`);
    return res.data;
  }
};

export const issuesAPI = {
  getAll: async () => {
    const res = await api.get('/api/issues');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/issues', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/issues/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/issues/${id}`);
    return res.data;
  }
};

export const nriProjectsAPI = {
  getAll: async () => {
    const res = await api.get('/api/nri/projects');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/nri/projects', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/nri/projects/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/nri/projects/${id}`);
    return res.data;
  }
};

export const volunteerAPI = {
  getAll: async () => {
    const res = await api.get('/api/nri/volunteers');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/nri/volunteers', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/nri/volunteers/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/nri/volunteers/${id}`);
    return res.data;
  }
};

export default api;
