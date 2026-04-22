import React, { createContext, useContext, useEffect, useState } from "react";
import api, {
  getAuthToken,
  getCurrentUser,
  removeAuthToken,
} from "../service/api";

interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const checkAuth = async () => {
    const token = await getAuthToken();

    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const result = await getCurrentUser();
    if (result.success) {
      setIsLoggedIn(true);
      setUser(result.user);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const logout = async () => {
    await removeAuthToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
