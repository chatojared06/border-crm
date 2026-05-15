# BorderCRM | AI-Powered B2B Sales Platform

**BorderCRM** es una plataforma SaaS B2B diseñada para optimizar el flujo de ventas y la gestión inteligente de prospectos (Leads). A diferencia de los CRMs tradicionales, integra un **Agente de IA (BorderAI)** para asistir en la toma de decisiones y automatizar la comunicación con clientes.

Este proyecto demuestra capacidades de arquitectura Monorepo, tipado estricto de extremo a extremo y despliegue profesional.

🚀 **Estado del Proyecto:** MVP Funcional y desplegado.

## 🌟 Características Principales

- **Dashboard Analítico:** Visualización de métricas clave (Leads totales, valor de pipeline y conversión).
- **Pipeline Kanban:** Gestión visual de estados de venta con persistencia real en base de datos.
- **BorderAI (Gemini Integration):** Asistente inteligente que analiza leads, sugiere acciones y genera correos electrónicos de seguimiento personalizados.
- **Responsive Design:** Interfaz optimizada para móviles (Pantalla completa) y escritorio (Floating Chat).
- **Seguridad Robusta:** Autenticación JWT, protección de rutas y encriptación de datos sensibles.

## 🛠 Tech Stack

**Frontend:**
- **React + Vite** (UI de alto rendimiento)
- **TypeScript** (Tipado estricto)
- **Tailwind CSS** (Diseño moderno y responsivo)
- **Lucide React** (Iconografía profesional)

**Backend:**
- **Node.js + Express** (API RESTful)
- **Prisma ORM** (Gestión de datos segura)
- **PostgreSQL (Neon DB)** (Base de datos Serverless)
- **JWT (JSON Web Tokens)** (Seguridad de sesión)

**IA & Cloud:**
- **Google Gemini API** (Motor de Inteligencia Artificial)
- **Netlify** (Despliegue de Frontend)
- **Render** (Despliegue de Backend)

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio

```bash

git clone [https://github.com/chatojared06/border-crm.git]
cd border-crm

### 2. Configuración del Backend

cd server
npm install

# Crea un archivo .env con: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY

npm run dev

### 3. Configuración del Frontend

cd ../client
npm install
npm run dev

```

### 📝 Roadmap Completado

[x] Core: Configuración de Monorepo y arquitectura de servicios.

[x] DB: Modelado de datos profesional con Prisma y PostgreSQL.

[x] Auth: Sistema de registro/login seguro con JWT.

[x] UI/UX: Layout responsivo y navegación profesional.

[x] Features: CRUD completo de Leads y Pipeline dinámico.

[x] AI: Integración de Agente inteligente con Gemini.

[x] Fixes: Optimización de chat responsivo para dispositivos móviles.

Hecho con 💙 por Jared | Ingeniero Fullstack