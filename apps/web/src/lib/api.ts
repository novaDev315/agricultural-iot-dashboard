const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const storage = localStorage.getItem('auth-storage');
      if (storage) {
        const { state } = JSON.parse(storage);
        if (state?.accessToken) {
          headers['Authorization'] = `Bearer ${state.accessToken}`;
        }
      }
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw { response: { data: error, status: response.status } };
    }

    const data = await response.json();
    return { data };
  }

  async post<T>(endpoint: string, body?: unknown): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw { response: { data: error, status: response.status } };
    }

    const data = await response.json();
    return { data };
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw { response: { data: error, status: response.status } };
    }

    const data = await response.json();
    return { data };
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw { response: { data: error, status: response.status } };
    }

    const data = await response.json().catch(() => ({}));
    return { data };
  }
}

export const api = new ApiClient(API_URL);
