import axios from 'axios';
import { useAuthStore } from '../store/auth';

// Get API URL from environment variable or use relative path for proxy
// In production on Vercel, use relative paths to avoid redirect loops
// The vercel.json rewrite will handle proxying to the backend
const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
const API_BASE_URL = isProduction 
  ? '/api/v1'  // Use relative path in production - vercel.json will proxy it
  : (import.meta.env.VITE_API_URL || '/api/v1');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if backend requires credentials
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          // refreshTokens returns TokensDto directly: { accessToken, refreshToken, expiresIn }
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          
          // Retry the original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    
    const message = error.response?.data?.error?.message || 'حدث خطأ غير متوقع';
    return Promise.reject(new Error(message));
  }
);

export default api;

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
};

// Articles API
export const articlesApi = {
  getAll: (params?: any) => api.get('/articles', { params }),
  getOne: (id: string) => api.get(`/articles/${id}`),
  create: (data: any) => api.post('/articles', data),
  update: (id: string, data: any) => api.patch(`/articles/${id}`, data),
  delete: (id: string) => api.delete(`/articles/${id}`),
  publish: (id: string) => api.post(`/articles/${id}/publish`),
  archive: (id: string) => api.post(`/articles/${id}/archive`),
};

// Categories API
export const categoriesApi = {
  getAll: (includeInactive?: boolean) =>
    api.get('/categories', { params: { includeInactive } }),
  getTree: () => api.get('/categories/tree'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Tags API
export const tagsApi = {
  getAll: (search?: string, type?: string) =>
    api.get('/tags', { params: { search, type } }),
  getPopular: (limit?: number) => api.get('/tags/popular', { params: { limit } }),
  getOne: (id: string) => api.get(`/tags/${id}`),
  create: (data: any) => api.post('/tags', data),
  update: (id: string, data: any) => api.patch(`/tags/${id}`, data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

// Media API
export const mediaApi = {
  getAll: (params?: any) => api.get('/media', { params }),
  getOne: (id: string) => api.get(`/media/${id}`),
  upload: (file: File, data?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    if (data) {
      Object.keys(data).forEach((key) => {
        if (data[key]) formData.append(key, data[key]);
      });
    }
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: string, data: any) => api.patch(`/media/${id}`, data),
  delete: (id: string) => api.delete(`/media/${id}`),
  getFolders: (parentId?: string) =>
    api.get('/media/folders', { params: { parentId } }),
  createFolder: (name: string, parentId?: string) =>
    api.post('/media/folders', { name, parentId }),
  deleteFolder: (id: string) => api.delete(`/media/folders/${id}`),
};

// Users API
export const usersApi = {
  getAll: (params?: any) => api.get('/users', { params }),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Pages API
export const pagesApi = {
  getAll: (params?: any) => api.get('/pages', { params }),
  getTree: (language?: string) => api.get('/pages/tree', { params: { language } }),
  getHomepage: (language?: string) => api.get('/pages/homepage', { params: { language } }),
  getOne: (id: string) => api.get(`/pages/${id}`),
  getBySlug: (slug: string, language?: string) =>
    api.get(`/pages/slug/${slug}`, { params: { language } }),
  create: (data: any) => api.post('/pages', data),
  update: (id: string, data: any) => api.patch(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
  publish: (id: string) => api.post(`/pages/${id}/publish`),
  archive: (id: string) => api.post(`/pages/${id}/archive`),
  setAsHomepage: (id: string) => api.post(`/pages/${id}/set-homepage`),
  reorder: (items: { id: string; sortOrder: number; parentId?: string | null }[]) =>
    api.post('/pages/reorder', items),
  // Translations
  getTranslations: (pageId: string) => api.get(`/pages/${pageId}/translations`),
  createTranslation: (pageId: string, data: any) =>
    api.post(`/pages/${pageId}/translations`, data),
  updateTranslation: (translationId: string, data: any) =>
    api.patch(`/pages/translations/${translationId}`, data),
  deleteTranslation: (translationId: string) =>
    api.delete(`/pages/translations/${translationId}`),
};

// Menus API
export const menusApi = {
  getAll: (params?: any) => api.get('/menus', { params }),
  getOne: (id: string) => api.get(`/menus/${id}`),
  getByLocation: (location: string, params?: any) =>
    api.get(`/menus/location/${location}`, { params }),
  getBySlug: (slug: string, params?: any) =>
    api.get(`/menus/slug/${slug}`, { params }),
  create: (data: any) => api.post('/menus', data),
  update: (id: string, data: any) => api.patch(`/menus/${id}`, data),
  delete: (id: string) => api.delete(`/menus/${id}`),
  // Menu Items
  createItem: (menuId: string, data: any) =>
    api.post(`/menus/${menuId}/items`, data),
  updateItem: (itemId: string, data: any) =>
    api.patch(`/menus/items/${itemId}`, data),
  deleteItem: (itemId: string) => api.delete(`/menus/items/${itemId}`),
  reorderItems: (menuId: string, items: any[]) =>
    api.post(`/menus/${menuId}/items/reorder`, items),
  // Menu Locations
  assignLocation: (menuId: string, location: string, priority?: number, conditions?: any) =>
    api.post(`/menus/${menuId}/locations`, { location, priority, conditions }),
  removeLocation: (menuId: string, location: string) =>
    api.delete(`/menus/${menuId}/locations/${location}`),
  // Dynamic Items
  getDynamicItems: (type: string, limit?: number) =>
    api.get(`/menus/dynamic/${type}`, { params: { limit } }),
};
