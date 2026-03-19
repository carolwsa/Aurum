import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, isAuthenticated } from "../service/api";

interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    const auth = await isAuthenticated();
    setIsLoggedIn(auth);
    if (auth) {
      const result = await getCurrentUser();
      if (result.success) setUser(result.user);
    }
  };

  useEffect(() => {
    checkAuth(); // Verifica ao iniciar o app
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
