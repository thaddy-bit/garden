
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Le compteur sera chargé par le Header quand l'utilisateur est connecté

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};