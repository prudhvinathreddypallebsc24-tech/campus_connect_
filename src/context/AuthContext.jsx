import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storageService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    // Validate empty fields
    if (!email || !email.trim()) {
      return { success: false, message: 'Please enter your email address' };
    }
    if (!password) {
      return { success: false, message: 'Please enter your password' };
    }
    if (!role) {
      return { success: false, message: 'Please select your institutional role' };
    }

    const matchedUser = storageService.getUserByEmail(email.trim());

    if (!matchedUser) {
      return {
        success: false,
        message: 'No account found with this email. Please check credentials or register.'
      };
    }

    if (matchedUser.password !== password) {
      return {
        success: false,
        message: 'Invalid password. Please try again.'
      };
    }

    if (matchedUser.role !== role) {
      return {
        success: false,
        message: `Account role mismatch: This account is registered as "${matchedUser.role}", not "${role}".`
      };
    }

    // Login successful
    storageService.setCurrentUser(matchedUser);
    storageService.logActivity('User Login', `${matchedUser.name} logged into ${role} dashboard`, matchedUser);
    setUser(matchedUser);
    return { success: true, user: matchedUser };
  };

  const register = async (userData) => {
    const { name, email, password, role, department, studentId, facultyId } = userData;

    if (!name || !name.trim()) {
      return { success: false, message: 'Full name is required' };
    }
    if (!email || !email.trim()) {
      return { success: false, message: 'Institutional email is required' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }
    if (!role) {
      return { success: false, message: 'Please select a valid role' };
    }

    const existingUser = storageService.getUserByEmail(email.trim());
    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please login instead.'
      };
    }

    const newUser = storageService.addUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      department: department || 'General Engineering',
      studentId: role === 'student' ? (studentId || `STU-${Date.now().toString().slice(-4)}`) : undefined,
      facultyId: role === 'faculty' ? (facultyId || `FAC-${Date.now().toString().slice(-4)}`) : undefined,
      semester: role === 'student' ? '1st Semester' : undefined,
      title: role === 'faculty' ? 'Assistant Professor' : (role === 'admin' ? 'University Staff' : undefined)
    });

    storageService.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    if (user) {
      storageService.logActivity('User Logout', `${user.name} logged out`);
    }
    storageService.clearCurrentUser();
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return null;
    const updated = storageService.updateUser(user.id, updates);
    if (updated) {
      setUser(updated);
      storageService.setCurrentUser(updated);
    }
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user
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
