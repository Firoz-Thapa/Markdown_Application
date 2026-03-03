// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = {
  // Auth endpoints
  register: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateProfile: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  changePassword: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Document endpoints
  getDocuments: async (token, query = {}) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/documents?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createDocument: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getDocument: async (id, token = null) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, { headers });
    return response.json();
  },

  updateDocument: async (token, id, data) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deleteDocument: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getDocumentVersions: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/versions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getPublicDocuments: async (query = {}) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/documents/public?${params}`);
    return response.json();
  },

  // User endpoints
  getUserStats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  searchUsers: async (token, query, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

export default api;
