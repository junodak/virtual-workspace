const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      const message = Array.isArray(data.message) ? data.message[0] : data.message;
      return { error: message || 'Request failed' };
    }

    return { data };
  } catch {
    return { error: 'Network error' };
  }
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const api = {
  register: (email: string, password: string, name?: string) =>
    request<AuthResponse>('/api/core/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/api/core/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: (token: string) =>
    request<User>('/api/core/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
