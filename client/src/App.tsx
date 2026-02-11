import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';

// Placeholder temporal para el Dashboard
const Dashboard = () => <div className="p-10 text-center"><h1>Bienvenido al Dashboard 🚀</h1></div>;

function App() {
  return (
    <BrowserRouter>
      {/* El Toaster sirve para mostrar notificaciones flotantes */}
      <Toaster position="top-right" richColors />
      
      <Routes>
        {/* Ruta pública: Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta privada: Dashboard (Por ahora abierta) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Si entran a la raíz, redirigir al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;