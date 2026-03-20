# 🚀 MiniTask Manager API

Una API REST profesional y escalable para la gestión de tareas personales, construida con **Django** y **Django REST Framework (DRF)**. Esta API ofrece funcionalidades avanzadas de autenticación JWT, documentación interactiva y gestión de tareas personalizada.

---

## 🛠️ Tecnologías Utilizadas

*   **Lenguaje:** [Python 3.x](https://www.python.org/)
*   **Framework Web:** [Django 5.x](https://www.djangoproject.com/)
*   **API Toolkit:** [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
*   **Autenticación:** [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
*   **Documentación:** [drf-spectacular](https://drf-spectacular.readthedocs.io/) (Swagger UI)
*   **CORS:** [django-cors-headers](https://github.com/adamchainz/django-cors-headers)
*   **Base de Datos:** SQLite (desarrollo)

---

## ✨ Características Principales

✅ **Autenticación Segura:** Registro de usuarios e inicio de sesión con tokens JWT (Access & Refresh tokens).
✅ **Gestión de Tareas (CRUD):** Creación, lectura, actualización y eliminación de tareas. 
✅ **Privacidad de Datos:** Cada usuario solo puede ver, editar o eliminar sus propias tareas.
✅ **Acciones Personalizadas:** Endpoint para cambiar rápidamente el estado de una tarea (`is_completed`).
✅ **Búsqueda y Filtrado:** Potentes capacidades de filtrado por estado y búsqueda por texto.
✅ **Soporte para Frontend (CORS):** Ya configurado para interactuar con proyectos de React (Vite/CRA).
✅ **Localización:** Configurado para zona horaria `America/Havana` y lenguaje `es-cu`.
✅ **Documentación Automática:** Swagger UI interactivo disponible desde el navegador.

---

## ⚡ Guía de Inicio Rápido

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd MiniTaskManager/minitask
```

### 2. Configurar el Entorno Virtual
```bash
python -m venv .venv
# En Windows:
.venv\Scripts\activate
# En Linux/macOS:
source .venv/bin/activate
```

### 3. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 4. Ejecutar Migraciones y Servidor
```bash
python manage.py migrate
python manage.py runserver
```

La API estará disponible en `http://127.0.0.1:8000/`.

---

## 📖 Documentación de la API

### Endpoints Principales

| Recurso | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/auth/register/` | Registro de nuevos usuarios. |
| **Auth** | POST | `/auth/login/` | Obtención de tokens (JWT). |
| **Auth** | POST | `/auth/token/refresh/` | Refrescar el token de acceso expirado. |
| **Tasks** | GET | `/api/tasks/` | Listar todas las tareas del usuario. |
| **Tasks** | POST | `/api/tasks/` | Crear una nueva tarea. |
| **Tasks** | GET | `/api/tasks/{id}/` | Detalle de una tarea específica. |
| **Tasks** | PUT/PATCH | `/api/tasks/{id}/` | Actualizar una tarea. |
| **Tasks** | DELETE | `/api/tasks/{id}/` | Eliminar una tarea. |
| **Tasks** | POST | `/api/tasks/{id}/toggle/` | Cambiar estado entre completado/pendiente. |

### Documentación Interactiva
Visita los siguientes enlaces con el servidor en ejecución para explorar la API:
- **Swagger UI:** `http://127.0.0.1:8000/api/schema/swagger-ui/`
- **Esquema OpenAPI:** `http://127.0.0.1:8000/api/schema/`

---

## 🔍 Filtrado y Búsqueda

La API permite optimizar las consultas mediante parámetros en la URL:

*   **Filtrar por estado:** `GET /api/tasks/?is_completed=true`
*   **Búsqueda por texto:** `GET /api/tasks/?search=mi_tarea`
*   **Ordenar por fecha:** `GET /api/tasks/?ordering=-created_at`

---

## 📂 Estructura del Proyecto

```text
minitask/
├── minitask/        # Configuración principal del proyecto
├── tasks/           # Aplicación principal de tareas
│   ├── models.py    # Modelo de Task (Vinculado a User)
│   ├── serializers.py # Serializadores de datos (Tasks y Users)
│   ├── views.py      # Lógica de ViewSets y Autenticación
│   └── urls.py       # Rutas internas de la aplicación
├── manage.py        # Entry point del comando Django
└── requirements.txt # Lista de dependencias del proyecto
```
