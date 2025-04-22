import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  useEffect(() => {
    const tokenVal =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const emailVal =
      typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (tokenVal) {
      setToken(tokenVal);
    } else {
      router.replace("/auth");
    }

    if(emailVal){
setEmail(emailVal)
    }
    setLoading(false);
  }, []);

  const login = (newToken, newEmail) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
      localStorage.setItem("email", newEmail);
      setToken(newToken);
      setEmail(newEmail);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setToken(null);
      router.replace("/auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, loading, setToken, email,setEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};
