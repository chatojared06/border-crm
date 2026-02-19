import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import NewLeadPage from './pages/NewLeadPage';
import EditLeadPage from './pages/EditLeadPage';


function App() {
  return (
    <BrowserRouter>
      {/* Toaster: Las notificaciones flotantes (ej: "Bienvenido") */}
      <Toaster position="top-right" richColors />
      
      <Routes>
        {/* 1. RUTA PÚBLICA: Cualquiera puede entrar aquí */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 2. RUTAS PRIVADAS*/}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
            {/* Estas son las páginas que se verán DENTRO del Layout */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Placeholders para las páginas que haremos después */}
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/leads/new" element={<NewLeadPage />} />
            <Route path="/leads/edit/:id" element={<EditLeadPage />} />
            <Route path="/pipeline" element={<div className="p-8">Aquí irá el Pipeline 📊</div>} />
            <Route path="/settings" element={<div className="p-8">Configuración ⚙️</div>} />
        </Route>
        
        {/* 3. RUTA POR DEFECTO:
            Si alguien entra a la raíz "/", lo mandamos directo al dashboard 
            (y si no tiene login, el guardia lo mandará al login) 
        */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;