const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AuthResponse {
  user_id: string;
  email?: string;
  error?: string;
}

interface ChatResponse {
  user_id: string;
  response: string;
  timestamp: string;
  error?: string;
}

interface UploadResponse {
  processed?: Record<string, unknown>;
  error?: string;
}

export const api = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name, email, password }),
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async guestLogin(): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
    });
    return res.json();
  },

  async chat(userId: string, query: string, isGuest: boolean = false): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, query, is_guest: isGuest }),
    });
    return res.json();
  },

  async upload(userId: string, file: File, isGuest: boolean = false): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('file', file);
    formData.append('is_guest', String(isGuest));
    
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },
};
