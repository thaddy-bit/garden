import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        Cookies.set("token", data.token, { expires: 7 }); // Session pendant 7 jours
        router.push("/");
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Email ou mot de passe incorrect" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Erreur de connexion" };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;