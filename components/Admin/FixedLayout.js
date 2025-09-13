import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function FixedAdminLayout({ children, containerClassName = "" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`h-screen min-h-0 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Spacer for fixed navbar height (adjust if navbar height changes) */}
          <div className="h-20" />

          <main className={`min-h-0 px-0 py-4 ${containerClassName}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


