import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// SILENCIADOR DE RECHARTS (Bug de la librería)
const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('The width(-1) and height(-1)')) {
    return; // Ignoramos esta advertencia específica
  }
  originalConsoleWarn(...args); // Dejamos pasar todas las demás advertencias reales
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
