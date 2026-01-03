import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { firebaseAuth } from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Wraps the app to provide auth state globally
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Listen for authentication state changes
   * Persists user session across app restarts
   */
  useEffect(() => {
    const unsubscribe = firebaseAuth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * Registers a new user with email and password
   * Provides human-friendly error messages
   */
  const register = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await firebaseAuth().createUserWithEmailAndPassword(email, password);
    } catch (err: any) {
      // Transform Firebase errors into user-friendly messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError('Registration failed. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs in an existing user
   * Validates credentials and provides clear feedback
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await firebaseAuth().signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      // Transform Firebase errors into user-friendly messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the current user
   * Clears all session data
   */
  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseAuth().signOut();
    } catch (err) {
      setError('Logout failed. Please try again.');
      throw err;
    }
  };

  /**
   * Clears error state
   * Used when user dismisses error messages
   */
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing auth context
 * Throws error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
