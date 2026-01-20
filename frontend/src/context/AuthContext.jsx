import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi ,getProfile } from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = async (data) => {
  const res = await loginApi(data);
  const user = res.data.user;

  if (!user.emailVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  setUser(user);
  return user;
};

  // ================= LOAD USER =================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await getProfile();
        const profileUser = res.data.user ?? res.data;

        setUser(profileUser);
        localStorage.setItem("user", JSON.stringify(profileUser));
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const register = async (data) => {
  const res = await registerApi(data);
  return res.data;
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
