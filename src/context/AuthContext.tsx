import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole, password?: string) => Promise<boolean>;
  quickLoginAs: (role: UserRole) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  upgradeToProsumer: (assetData: { assetName: string; capacityKw: number; sourceType: string }) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial check: DO NOT auto-login to preserve rule "AUTHENTICATION MUST BE THE FIRST SCREEN"
  useEffect(() => {
    // Check if a session was previously explicitly saved
    const savedToken = localStorage.getItem('pgx_auth_token');
    const savedUser = localStorage.getItem('pgx_auth_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('pgx_auth_token');
        localStorage.removeItem('pgx_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role?: UserRole, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, password }),
      });
      if (!res.ok) {
        setIsLoading(false);
        return false;
      }
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('pgx_auth_token', data.token);
      localStorage.setItem('pgx_auth_user', JSON.stringify(data.user));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      return false;
    }
  };

  const quickLoginAs = async (role: UserRole): Promise<boolean> => {
    return login('', role);
  };

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        setIsLoading(false);
        return false;
      }
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('pgx_auth_token', data.token);
      localStorage.setItem('pgx_auth_user', JSON.stringify(data.user));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setIsLoading(false);
      return false;
    }
  };

  const upgradeToProsumer = async (assetData: { assetName: string; capacityKw: number; sourceType: string }): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/users/upgrade-to-prosumer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(assetData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('pgx_auth_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Upgrade error:', err);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('pgx_auth_user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pgx_auth_token');
    localStorage.removeItem('pgx_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLoginAs,
        register,
        logout,
        upgradeToProsumer,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
