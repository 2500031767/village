import axios from 'axios';

// Base URL — empty in dev for Vite proxy, uses VITE_API_URL in production
const API_BASE = import.meta.env.VITE_API_URL || '';

// Direct server URL — used only for file uploads to bypass Vite proxy
// (Vite proxy aborts large multipart requests with ECONNABORTED)
const SERVER_DIRECT = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE
});

// Separate instance for direct server calls (file uploads)
const apiDirect = axios.create({
  baseURL: SERVER_DIRECT
});

// Attach JWT to both instances
const authInterceptor = (config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));
apiDirect.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));
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
  create: async (formData) => {
    // Use direct server connection — Vite proxy aborts multipart POST
    const res = await apiDirect.post('/api/gallery', formData);
    return res.data;
  },
  update: async (id, payload) => {
    if (payload instanceof FormData) {
      // File upload — go direct to bypass Vite proxy
      const res = await apiDirect.put(`/api/gallery/${id}`, payload);
      return res.data;
    }
    // JSON update (no new file) — proxy is fine for this
    const res = await api.put(`/api/gallery/${id}`, payload);
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
  getAll: async (includeAll = false) => {
    const res = await api.get(includeAll ? '/api/issues/all' : '/api/issues');
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
  },
  report: async (data) => {
    const res = await api.post('/api/issues/report', data);
    return res.data;
  },
  upvote: async (id) => {
    const res = await api.post(`/api/issues/${id}/upvote`);
    // returns { updated, categoryTotals }
    return res.data;
  },
  recalculate: async () => {
    const res = await api.post('/api/issues/recalculate-priorities');
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

export const censusAPI = {
  getAll: async () => {
    const res = await api.get('/api/census');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/census', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/census/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/census/${id}`);
    return res.data;
  }
};

export const villageStatsAPI = {
  getAll: async () => {
    const res = await api.get('/api/village-stats');
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/api/village-stats/categories');
    return res.data;
  },
  upsert: async (data) => {
    const res = await api.post('/api/village-stats', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/village-stats/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/village-stats/${id}`);
    return res.data;
  }
};

export const ratingsAPI = {
  getAll: async () => {
    const res = await api.get('/api/ratings');
    return res.data;
  },
  submit: async (data) => {
    const res = await api.post('/api/ratings', data);
    return res.data;
  }
};

export const memberAPI = {
  // Existing single-member helpers (kept for compatibility)
  login: async (name, phone) => {
    const res = await api.post('/api/member/login', { name, phone });
    return res.data;
  },
  getMyIssues: async (phone) => await api.get(`/api/member/${phone}/issues`),
  saveMember: (member) => localStorage.setItem('village_member', JSON.stringify(member)),
  getMember: () => {
    try { return JSON.parse(localStorage.getItem('village_member')); }
    catch { return null; }
  },
  logout: () => localStorage.removeItem('village_member'),
  isLoggedIn: () => !!localStorage.getItem('village_member'),

  // New multi‑member management (admin portal will use these)
  getAllMembers: () => {
    try {
      const members = JSON.parse(localStorage.getItem('village_members')) || [];
      if (members.length === 0) {
        const defaultMember = { username: 'BMSR', password: '732306' };
        localStorage.setItem('village_members', JSON.stringify([defaultMember]));
        return [defaultMember];
      }
      return members;
    } catch {
      const defaultMember = { username: 'BMSR', password: '732306' };
      localStorage.setItem('village_members', JSON.stringify([defaultMember]));
      return [defaultMember];
    }
  },
  saveAllMembers: (members) => {
    localStorage.setItem('village_members', JSON.stringify(members));
  },
  addMember: (member) => {
    const members = memberAPI.getAllMembers();
    members.push(member);
    memberAPI.saveAllMembers(members);
  },
  updateMember: (username, updates) => {
    const members = memberAPI.getAllMembers().map(m => m.username === username ? { ...m, ...updates } : m);
    memberAPI.saveAllMembers(members);
  },
  deleteMember: (username) => {
    const members = memberAPI.getAllMembers().filter(m => m.username !== username);
    memberAPI.saveAllMembers(members);
  }
};

// OTP authentication API
export const otpAuthAPI = {
  requestOtp: async (phone) => {
    const res = await api.post('/api/auth/request-otp', { phone });
    return res.data;
  },
  verifyOtp: async (phone, code) => {
    const res = await api.post('/api/auth/verify-otp', { phone, code });
    return res.data;
  }
};

export default api;
