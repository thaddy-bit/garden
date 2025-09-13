// components/Layout.js
import Header from './Header';
import UltraPremiumFooter from './UltraPremiumFooter';
// import { AuthProvider } from "../context/AuthContext";

export default function Layout({ children }) {
  return (
      <div className="">
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <UltraPremiumFooter/>
      </div>
  );
}