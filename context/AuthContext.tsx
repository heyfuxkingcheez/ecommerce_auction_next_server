'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const AccessToken = Cookies.get('AccessToken');
      console.log(AccessToken);
      if (AccessToken) {
        setIsLoggedIn(true);
        setToken(AccessToken);
      } else {
        setIsLoggedIn(false);
        setToken(null);
        router.push('/login');
      }
    };

    checkAuth();
  }, [pathName]);

  const logout = () => {
    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, token }}>
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
