import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

const DEMO_SESSION_KEY = 'shree-laxmi-inn:demo-admin-session';

/**
 * Demo-mode credentials, used only when no Firebase project is
 * configured. This exists purely so reviewers can open the Admin Panel
 * without setting up a Firebase project first. It is NOT a real
 * authentication system: replace it with Firebase Auth (see
 * README.md > "Connect your own Firebase project") before going live.
 */
const DEMO_ADMIN_EMAIL = import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@shreelaxmiinn.example';
const DEMO_ADMIN_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'ayodhya-demo';

export function AuthProvider({ children }) {
  // In demo mode, the session is read synchronously from localStorage as
  // the initial state itself, so no effect is needed for that path. When
  // Firebase is configured, `user` starts null and isLoading starts true
  // until onAuthStateChanged reports back below.
  const [user, setUser] = useState(() => {
    if (isFirebaseConfigured) return null;
    const storedSession = window.localStorage.getItem(DEMO_SESSION_KEY);
    return storedSession ? { email: storedSession, isDemo: true } : null;
  });
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
  }, []);

  const signIn = async (email, password) => {
    if (isFirebaseConfigured) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    }

    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      window.localStorage.setItem(DEMO_SESSION_KEY, email);
      const demoUser = { email, isDemo: true };
      setUser(demoUser);
      return demoUser;
    }

    throw new Error('Invalid email or password.');
  };

  const signOut = async () => {
    if (isFirebaseConfigured) {
      await firebaseSignOut(auth);
      return;
    }
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isDemoAuth: !isFirebaseConfigured,
      demoCredentials: isFirebaseConfigured
        ? null
        : { email: DEMO_ADMIN_EMAIL, password: DEMO_ADMIN_PASSWORD },
      signIn,
      signOut,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
