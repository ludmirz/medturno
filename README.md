# 🩺 MedTurno

Aplicación web para gestión de turnos médicos con IA integrada para consulta de síntomas.

🔗 **Demo en vivo:** [medturno-5g69jn4yy-ludmirzs-projects.vercel.app](https://medturno-six.vercel.app/)

---

## ✨ Funcionalidades

- **Registro e inicio de sesión** con autenticación JWT y contraseñas encriptadas con bcrypt
- **Sacar turnos médicos** eligiendo especialidad, zona de atención y horario
- **Obra social opcional** — se puede agregar al registrarse y se usa automáticamente al sacar turnos
- **Mis turnos** — visualización y cancelación de turnos del usuario logueado
- **Consultor de síntomas con IA** — el usuario describe sus síntomas y la IA sugiere el especialista adecuado
- **Recordatorios por email** automáticos el día anterior al turno (via Nodemailer + node-cron)
- **Modo simulación** — cualquier usuario puede explorar la app sin registrarse

---

## 🛠️ Stack

**Frontend**
- React 19 + Vite
- CSS Variables con diseño fintech/minimalista
- Context API para manejo de autenticación

**Backend**
- Node.js + Express
- SQLite con better-sqlite3
- JWT para autenticación
- bcryptjs para encriptación de contraseñas
- Nodemailer + node-cron para recordatorios automáticos
- Google Gemini API para el chat de síntomas (próximo a implementar)

**Deploy**
- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com)

---

## Para correr de manera local...

### Requisitos
- Node.js 18+

### Frontend

```bash
git clone https://github.com/ludmirz/medturno
cd medturno
npm install
npm run dev
```

Crear `.env` en la raíz:
```
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK=true
```

### Backend

```bash
cd backend
npm install
node server.js
```

Crear `backend/.env`:
```
API_KEY=tu_gemini_api_key
JWT_SECRET=tu_jwt_secret
PORT=3001
```

---

## 📁 Estructura del proyecto

```
medturno/
├── src/
│   ├── components/
│   │   ├── Landing.jsx       # Pantalla de bienvenida
│   │   ├── TurnosFlow.jsx    # Flujo de 4 pasos para sacar turno
│   │   ├── ChatIA.jsx        # Chat de síntomas con IA
│   │   ├── MisTurnos.jsx     # Listado y cancelación de turnos
│   │   └── AuthModal.jsx     # Modal de login y registro
│   ├── context/
│   │   └── AuthContext.jsx   # Contexto de autenticación global
│   ├── App.jsx
│   └── App.css
└── backend/
    ├── routes/
    │   ├── auth.js           # Register y login
    │   ├── turnos.js         # CRUD de turnos
    │   └── chatIA.js         # Proxy a Gemini API
    ├── services/
    │   └── recordatorios.js  # Cron job de emails
    ├── database.js           # Configuración SQLite
    └── server.js             # Entry point
```

---

## 🔐 Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL del backend |
| `VITE_USE_MOCK` | `true` para usar IA simulada |
| `API_KEY` | API Key de Google Gemini |
| `JWT_SECRET` | Clave secreta para tokens JWT |
| `PORT` | Puerto del backend (default 3001) |

---

## 📸 Flujo de la app

1. El usuario entra y ve la landing con opción de login, registro o exploración sin cuenta
2. Puede simular un turno sin registrarse para ver zonas y obras sociales disponibles
3. Al confirmar el turno se le pide iniciar sesión o registrarse
4. Una vez logueado puede ver y cancelar sus turnos desde "Mis turnos"
5. En cualquier momento puede consultar sus síntomas con la IA para saber qué especialista necesita

---

## 👩‍💻 Autora

Desarrollado por **Ludmila Ramírez** como proyecto personal.
