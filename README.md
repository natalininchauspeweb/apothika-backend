# 🌿 Apothika — Plataforma de Fidelización para Farmacias (White-Label: Farmacia Dalton)

**Asignatura:** Aplicaciones Híbridas  
**Institución:** Escuela Da Vinci  
**Instancia:** Examen Parcial 2 — Proyecto FullStack MERN  
**Autora:** Natalin Inchauspe  



## 📋 Descripción del Proyecto

**Apothika** es una aplicación web FullStack desarrollada bajo el stack **MERN** (MongoDB, Express, React.js y Node.js) diseñada como un sistema de fidelización gamificado de marca blanca (*white-label*), personalizado en esta implementación para **Farmacia Dalton**.

El sistema permite que la farmacia gestione su catálogo exclusivo de productos de dermocosmética y bienestar, otorgue puntos a sus pacientes en función de sus compras ($100 ARS = 1 punto) y procese el canje de recompensas en tiempo real validando la identidad y el saldo mediante **JSON Web Tokens (JWT)**.

---

## 🚀 Tecnologías Utilizadas

### Backend (API REST)
* **Node.js & Express.js:** Arquitectura en capas (Rutas, Controladores, Modelos y Middlewares).
* **MongoDB Atlas & Mongoose:** Modelado de datos con validaciones a nivel de esquema y referencias (`ObjectId` / `populate`) entre 3 entidades: **Usuarios (`User`)**, **Productos (`Product`)** y **Transacciones (`Transaction`)**.
* **JSON Web Tokens (`jsonwebtoken`):** Autenticación y protección de rutas privadas mediante middleware personalizado (`verificarToken`).
* **Bcrypt (`bcrypt`):** Encriptación irreversible (*hashing*) de contraseñas.
* **CORS & Dotenv:** Configuración de seguridad de orígenes cruzados y variables de entorno.

### Frontend (SPA)
* **React.js (Vite):** Construcción de interfaz reactiva mediante componentes funcionales y Hooks (`useState`, `useEffect`, `useContext`).
* **React Router DOM:** Enrutamiento declarativo con protección de rutas privadas (`ProtectedRoute`) y navegación programática (`useNavigate`, `Link`).
* **Context API (`AuthContext`):** Gestión del estado global de sesión y sincronización persistente del saldo de puntos en `localStorage`.
* **Servicios de API (`fetch`):** Separación estricta entre las vistas (`views/`) y la lógica de comunicación HTTP (`services/`).
* **CSS3 Puro (`style.css`):** Sistema de diseño gamificado desacoplado de los componentes (sin estilos en línea).

---

## 📂 Estructura del Proyecto

### `apothika-backend/`
```text
├── config/
│   └── db.js                      # Conexión a MongoDB Atlas
├── controllers/
│   ├── AuthController.js          # Registro y Login con JWT y Bcrypt
│   ├── ProductController.js       # Operaciones CRUD del catálogo
│   └── TransactionController.js   # Suma de puntos, canjes e historial
├── middlewares/
│   └── authMiddleware.js          # Verificación de token JWT
├── models/
│   ├── UserModel.js               # Esquema de Usuarios (farmacia / paciente)
│   ├── ProductModel.js            # Esquema de Productos del catálogo
│   └── TransactionModel.js        # Esquema de Transacciones (suma / canje)
├── public/images/                 # Activos multimedia servidos estáticamente
├── routes/
│   ├── AuthRouter.js              # Rutas /api/auth
│   ├── ProductRouter.js           # Rutas /api/productos
│   └── TransactionRouter.js       # Rutas /api/transacciones
├── .env                           # Variables de entorno (entregado aparte)
├── index.js                       # Punto de entrada del servidor Express
└── pruebas.http                   # Documentación interactiva de pruebas CRUD