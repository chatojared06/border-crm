# BorderCRM

**BorderCRM** es una plataforma SaaS B2B diseñada para optimizar el flujo de ventas y la gestión de prospectos (Leads). Este proyecto es una solución Fullstack construida con estándares de industria, enfocada en rendimiento, tipado estricto y escalabilidad.

🚧 **Estado del Proyecto:** En desarrollo activo (Fase de Arquitectura).

## 🛠 Tech Stack

**Frontend:**
- React + Vite
- TypeScript
- Tailwind CSS
- TanStack Query (Estado del servidor)
- React Hook Form + Zod (Validaciones)

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication

**DevOps & Tools:**
- Docker (Próximamente)
- Eslint + Prettier
- Monorepo Architecture

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para levantar el entorno de desarrollo:

### 1. Clonar el repositorio
```bash
git clone https://github.com/chatojared06/border-crm.git
cd border-crm
```

### Backend (API)
```bash
cd server
npm install
npm run dev
# El servidor correrá en https://border-crm.onrender.com
```

###  Frontend (Cliente)
```bash
cd client
npm install
npm run dev
# La UI correrá en https://border-crm.onrender.com
```

## 📝 Roadmap

- [x] Arquitectura inicial y configuración del Monorepo.
- [x] Diseño de Base de Datos y configuración de Prisma.
- [x] Sistema de Autenticación (JWT).
- [x] Conexión Frontend-Backend (Login).
- [x] Estructura del Dashboard y Sidebar (Layout Principal).
- [x] CRUD de Leads: Crear (Formulario). 
- [x] CRUD de Leads: Leer (Tabla y Dashboard). 
- [x] CRUD de Leads: Borrar (Eliminación dinámica). 
- [x] CRUD de Leads: Editar (Actualizar datos). 
- [x] Integración de IA.
- [x] Diseño responsivo.
---
Hecho con 💙 por [Jared](https://github.com/chatojared06)

### Paso 2: Envía la corrección (El flujo de siempre)
En tu terminal:

```bash
git add README.md
git commit -m "docs: corregir formato y estilos del readme"
git push