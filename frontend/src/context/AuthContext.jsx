import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null); //global state for auth info, we can access it from any component without prop drilling. it holds the current user info, JWT token, and auth functions like login, register, logout.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const response = await authService.getMe();
          setUser(response.data);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { access_token } = response.data;
    localStorage.setItem("token", access_token);
    setToken(access_token);
    const userResponse = await authService.getMe();
    setUser(userResponse.data);
    return userResponse.data;
  };

  const register = async (name, email, password) => {
    await authService.register({ name, email, password });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};