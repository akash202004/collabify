import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.username === username);
    
    if (foundUser && password === 'password') { // Simplified auth
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: User) => u.username === username || u.email === email)) {
      return false;
    }

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return { user, login, register, logout, isLoading };
};