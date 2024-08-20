'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isLoggedIn: boolean;
  logout: () => void;
  token: string | null;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const checkAuthStatus = () => {
    const AccessToken = Cookies.get('AccessToken');
    if (AccessToken) {
      setIsLoggedIn(true);
      setToken(AccessToken);
    } else {
      setIsLoggedIn(false);
      setToken(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [token]);

  const logout = () => {
    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');
    setToken(null);
    setIsLoggedIn(false);

    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, logout, token, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
