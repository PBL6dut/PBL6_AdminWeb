import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { set } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log('authcontext')

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await authService.verifyToken(token);
          if (response && response.success) {
            const userData = response.data.admin;
            setUser(userData);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response && response.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        setUser(response.data.admin);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    return <Navigate to="/auth/login" replace />;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
