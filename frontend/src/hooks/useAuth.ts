import { useState, useEffect } from 'react';
import { User } from '@/types/sweet';
import {http} from '@/api/http'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sweetshop_token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/protected`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('sweetshop_token');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('sweetshop_token');
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('Login response:', response);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('sweetshop_token', data.token);
        await fetchUser(data.token);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (response.ok) {
        // Registration successful, but don't log in automatically
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('sweetshop_token');
    setUser(null);
  };

  return { user, loading, login, logout, register };
};
