import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Inscription
  const register = async (fullName: string, email: string, password: string, role: string = 'user'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, role }),
      });
      if (response.ok) {
        const data: AuthResponse = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Connexion
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data: AuthResponse = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Récupérer le profil
  const getProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } else {
      logout();
      return null;
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (fullName: string, email: string) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName, email }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Update failed' };
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    getToken,
    isAuthenticated: !!user,
  };
}; 