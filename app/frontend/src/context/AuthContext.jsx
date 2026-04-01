import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, registerRequest, verifyRequest } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const login = async (email, password) => {
    const tokenData = await loginRequest({ email, password });

    if (!tokenData?.token) {
      throw new Error('No se recibió el token del servidor');
    }

    localStorage.setItem('token', tokenData.token);

    const verifyData = await verifyRequest();

    setUser({
      email: verifyData.user,
      nombre: verifyData.nombre,
      apellido: verifyData.apellido,
      rol: verifyData.rol,
    });
  };

  const register = async (data) => {
    return await registerRequest(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoadingAuth(false);
      return;
    }

    try {
      const verifyData = await verifyRequest();

      setUser({
        email: verifyData.user,
        nombre: verifyData.nombre,
        apellido: verifyData.apellido,
        rol: verifyData.rol,
      });
    } catch (error) {
      console.error('Error verificando token:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loadingAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook separado pero dentro del mismo archivo (forma compatible con Vite si no cambian exports dinámicamente)
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}