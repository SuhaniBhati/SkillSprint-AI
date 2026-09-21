import { createContext, useEffect, useState } from "react";
import {
  login,
  register,
  logout,
  getMe,
} from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user only once
  useEffect(() => {
    let isMounted = true;

    const initializeUser = async () => {
      try {
        const response = await getMe();

        if (!isMounted) return;

        if (response.success) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      setUser(response.user);

      return response;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({
    username,
    email,
    password,
  }) => {
    setLoading(true);

    try {
      const response = await register({
        username,
        email,
        password,
      });

      setUser(response.user);

      return response;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};