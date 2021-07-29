import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const users = ["mediaone", "tom", "sales", "seo"];
  const [user, setUser] = useState(sessionStorage.getItem("user"));
  const [status, setStatus] = useState(null);

  const login = async (username, password) => {
    if (users.indexOf(username.toLowerCase()) > -1) {
      if (password === process.env.REACT_APP_PASSWORD) {
        sessionStorage.setItem("user", username);
        await setUser(username);
      } else {
        setStatus("Invalid password");
        await logout();
      }
    } else {
      setStatus("Invalid username");
      await logout();
    }
  };

  const logout = async () => {
    sessionStorage.clear();
    await setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
