/**
 * GlobeTrotter API Client
 * Provides standard HTTP REST abstraction with automatic fallback to LocalStorage mock state
 * so the frontend is fully ready for a real REST API / PostgreSQL backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // default to mock if backend URL isn't configured

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const apiClient = {
  async get<T>(endpoint: string, mockFallback: () => T): Promise<T> {
    if (USE_MOCK) {
      await simulateDelay();
      return mockFallback();
    }
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const json = await response.json();
      return json.data || json;
    } catch (err) {
      console.warn(`API call GET ${endpoint} failed, using local mock fallback.`, err);
      return mockFallback();
    }
  },

  async post<T>(endpoint: string, payload: any, mockFallback: () => T): Promise<T> {
    if (USE_MOCK) {
      await simulateDelay();
      return mockFallback();
    }
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const json = await response.json();
      return json.data || json;
    } catch (err) {
      console.warn(`API call POST ${endpoint} failed, using local mock fallback.`, err);
      return mockFallback();
    }
  },

  async put<T>(endpoint: string, payload: any, mockFallback: () => T): Promise<T> {
    if (USE_MOCK) {
      await simulateDelay();
      return mockFallback();
    }
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const json = await response.json();
      return json.data || json;
    } catch (err) {
      console.warn(`API call PUT ${endpoint} failed, using local mock fallback.`, err);
      return mockFallback();
    }
  },

  async delete<T>(endpoint: string, mockFallback: () => T): Promise<T> {
    if (USE_MOCK) {
      await simulateDelay();
      return mockFallback();
    }
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const json = await response.json();
      return json.data || json;
    } catch (err) {
      console.warn(`API call DELETE ${endpoint} failed, using local mock fallback.`, err);
      return mockFallback();
    }
  }
};

function getAuthHeaders() {
  const token = localStorage.getItem('globetrotter_token') || 'demo-bearer-token';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

function simulateDelay(ms: number = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
