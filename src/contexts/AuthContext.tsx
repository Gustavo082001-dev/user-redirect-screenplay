import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: string | null;
  userName: string | null;
  userKey: string | null;
  login: (userType: string, userName: string, userKey: string) => void;
  logout: () => void;
  renewSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos em millisegundos

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  // Verificar sessão existente ao carregar a aplicação
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Configurar listeners para atividade do usuário
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const resetTimer = () => {
        renewSession();
      };

      events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetTimer, true);
        });
      };
    }
  }, [isAuthenticated]);

  const checkExistingSession = () => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      try {
        const { userType, userName, userKey, timestamp } = JSON.parse(sessionData);
        const now = Date.now();
        
        if (now - timestamp < SESSION_TIMEOUT) {
          // Sessão ainda válida
          setIsAuthenticated(true);
          setUserType(userType);
          setUserName(userName);
          setUserKey(userKey);
          startSessionTimer();
          
          // Atualizar timestamp
          localStorage.setItem('userSession', JSON.stringify({
            userType,
            userName,
            userKey,
            timestamp: now
          }));
        } else {
          // Sessão expirada
          logout();
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou. Faça login novamente.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        logout();
      }
    }
  };

  const startSessionTimer = () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }

    const timer = setTimeout(() => {
      logout();
      toast({
        title: "Sessão expirada",
        description: "Você foi desconectado por inatividade (30 minutos).",
        variant: "destructive"
      });
    }, SESSION_TIMEOUT);

    setSessionTimer(timer);
  };

  const login = (userType: string, userName: string, userKey: string) => {
    const sessionData = {
      userType,
      userName,
      userKey,
      timestamp: Date.now()
    };

    localStorage.setItem('userSession', JSON.stringify(sessionData));
    setIsAuthenticated(true);
    setUserType(userType);
    setUserName(userName);
    setUserKey(userKey);
    startSessionTimer();
  };

  const logout = () => {
    localStorage.removeItem('userSession');
    setIsAuthenticated(false);
    setUserType(null);
    setUserName(null);
    setUserKey(null);
    
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
  };

  const renewSession = () => {
    if (isAuthenticated && userType && userName && userKey) {
      const sessionData = {
        userType,
        userName,
        userKey,
        timestamp: Date.now()
      };
      localStorage.setItem('userSession', JSON.stringify(sessionData));
      startSessionTimer();
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userType,
      userName,
      userKey,
      login,
      logout,
      renewSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};