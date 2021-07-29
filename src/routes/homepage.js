import React from "react";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();

  return <h1>WELCOME {String(user).toUpperCase()}</h1>;
};

export default HomePage;
