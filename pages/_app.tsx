import "@/styles/globals.css";
import { CartProvider } from "../context/CartContext";
// import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
