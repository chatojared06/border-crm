import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import AIAgentChat from "./AIAgentChat";

export const Layout = () => {
  return (
    <div className="flex mt-16 md:mt-0 h-screen bg-slate-50 overflow-hidden">
      {/* 1. Sidebar Fija a la izquierda */}
      <Sidebar />

      {/* 2. Área de Contenido Principal (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-8 pb-28">
        <div className="max-w-7xl mx-auto">
          {/* Aquí se renderizarán Dashboard, Leads, etc. */}
          <Outlet />
        </div>
      </main>

      {/* 3. widget flotante de IA */}
      <AIAgentChat />
    </div>
  );
};