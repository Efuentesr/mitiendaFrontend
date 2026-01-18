// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api"
import { CART_PRODUCTS } from "../services/constants"
export const AuthContext = createContext();

const react_url = import.meta.env.VITE_API_URL || "no hay base";

export const AuthProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wempresa, setWempresa] = useState(1);
  const [cartProducts, setCartProducts ] = useState(() => {
      const storedProducts = JSON.parse(localStorage.getItem(CART_PRODUCTS));
      if (!storedProducts) {
        localStorage.setItem(CART_PRODUCTS, JSON.stringify([]));
        return [];
      }
      return storedProducts;
  });

// inicializar loggedUser
  const fetchUser = async () => {
    setIsLoading(true)    ;
    try {
      const access = localStorage.getItem("access");
      if (access){
        const response = await api.get("api/user");
        const currentUser = response.data;
        // console.log("AuthContext.jsx, -> fetchUser: response.data.username ", currentUser);
        setLoggedUser(currentUser);
      }
    } catch (error) {
      console.error("Error al verificar login:", error);
    } 
    setIsLoading(false);
  };

  // Llamar a fetchUser al montar la app
  useEffect(() => {
    const checkUser = async () => {
      await fetchUser();
    };
    checkUser();
  },[])

  return (
    <AuthContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        loggedUser,
        setLoggedUser,
        isLoading,
        setIsLoading,
        wempresa,
        setWempresa,
        fetchUser, // Exportamos la función para uso global
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
