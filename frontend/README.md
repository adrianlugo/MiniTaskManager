# 🎨 MiniTask Manager Frontend

Una interfaz moderna, rápida y estética para la gestión de tareas. Construida con **React** y **Vite**, esta aplicación ofrece una experiencia de usuario (UX) fluida y profesional diseñada para maximizar la productividad.

---

## ✨ Características Principales

✅ **Interfaz "Premium" (Glassmorphism):** Diseño moderno con efectos de cristal, transparencias y animaciones suaves para una experiencia visual envolvente.
✅ **Panel de Control Dinámico:** 
   - **Pendientes:** Conteo en tiempo real de lo que queda por hacer.
   - **Completadas:** Visualización instantánea de tus logros.
   - **Histórico de Borradas:** Registro persistente (vía `localStorage`) de cuántas tareas has eliminado en total.
✅ **CRUD Completo:** 
   - Añadir tareas con descripción.
   - **Edición Rápida:** Sube una tarea al formulario con un clic para actualizarla sin perder el contexto.
   - **Seguridad en Borrado:** Confirmación obligatoria antes de eliminar para prevenir errores accidentales.
✅ **Autenticación:** Integración completa con JWT para sesiones seguras.
✅ **Búsqueda en Tiempo Real:** Filtra tus tareas conforme escribes.

---

## 🛠️ Tecnologías

*   **Framework:** [React 18](https://reactjs.org/)
*   **Herramienta de Construcción:** [Vite](https://vitejs.dev/)
*   **Iconografía:** [Lucide React](https://lucide.dev/)
*   **Estilos:** CSS Vanilla (Custom Design System)
*   **Comunicación API:** [Axios](https://axios-http.com/) con interceptores para JWT.

---

## 🚀 Instalación y Ejecución

### 1. Preparar el entorno
Asegúrate de tener [Node.js](https://nodejs.org/) instalado.

```bash
cd frontend
npm install
```

### 2. Configurar la API
Asegúrate de que el backend esté ejecutándose en `http://127.0.0.1:8000/`. El frontend está configurado por defecto para conectar con esta dirección.

### 3. Iniciar el modo desarrollo
```bash
npm run dev
```

La aplicación se abrirá en tu navegador (típicamente en `http://localhost:5173/`).

---

## 📂 Estructura del Código

```text
frontend/
├── src/
│   ├── api.js         # Configuración centralizada de Axios e Interceptores
│   ├── pages/
│   │   ├── Tasks.jsx  # Gestión principal de tareas (Dashboard + CRUD)
│   │   ├── Login.jsx  # Interfaz de acceso
│   │   └── Register.jsx # Registro de usuarios
│   ├── components/    # Componentes reutilizables
│   ├── App.jsx        # Routing y estructura base
│   └── index.css      # Sistema de diseño (tokens de color, animaciones)
└── README.md
```
