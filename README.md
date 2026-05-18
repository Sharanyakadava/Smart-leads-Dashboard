# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the **MERN stack** and **TypeScript**.

## ✨ Features

- **JWT Authentication** — Register, Login, Protected routes, bcrypt password hashing
- **Role-Based Access Control** — Admin (full access) & Sales (view/update status only)
- **Lead Management (CRUD)** — Create, read, update, delete leads
- **Advanced Filtering** — Filter by status, source, search by name/email, sort (latest/oldest)
- **Debounced Search** — 400ms debounce to reduce unnecessary API calls
- **Backend Pagination** — 10 records/page with full metadata
- **CSV Export** — Export filtered leads (Admin only)
- **Dark Mode** — Full light/dark theme support
- **Docker Support** — One-command setup with Docker Compose

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|------------------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Zustand, React Query |
| Backend   | Node.js, Express.js, TypeScript                |
| Database  | MongoDB, Mongoose                              |
| Auth      | JWT, bcryptjs                                  |
| DevOps    | Docker, Docker Compose, Nginx                  |

## 📁 Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helpers (JWT, response)
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # ProtectedRoute
│   │   │   ├── layout/     # Navbar
│   │   │   ├── leads/      # Lead-specific components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── hooks/          # useLeads, useDebounce
│   │   ├── pages/          # LoginPage, RegisterPage, DashboardPage
│   │   ├── services/       # API service layer
│   │   ├── store/          # Zustand stores
│   │   └── types/          # Shared TypeScript types
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## 🚀 Getting Started

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone <your-repo-url>
cd smart-leads-dashboard

# Start everything
docker-compose up --build

# App runs at:
# Frontend → http://localhost:80
# Backend  → http://localhost:5000
# MongoDB  → localhost:27017
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                  | Default             |
|----------------|------------------------------|---------------------|
| `PORT`         | Server port                  | `5000`              |
| `NODE_ENV`     | Environment                  | `development`       |
| `MONGODB_URI`  | MongoDB connection string     | (required)          |
| `JWT_SECRET`   | JWT signing secret           | (required, change!) |
| `JWT_EXPIRY`   | JWT token expiry             | `7d`                |
| `CLIENT_URL`   | Allowed CORS origin          | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable        | Description         | Default                   |
|-----------------|---------------------|---------------------------|
| `VITE_API_URL`  | Backend API base URL | `http://localhost:5000/api` |

## 🔐 Roles & Permissions

| Feature           | Admin | Sales |
|-------------------|-------|-------|
| View Leads        | ✅    | ✅    |
| Create Lead       | ✅    | ❌    |
| Update Lead       | ✅    | ✅ (status only) |
| Delete Lead       | ✅    | ❌    |
| Export CSV        | ✅    | ❌    |

## 📖 API Documentation

See [API_DOCS.md](./API_DOCS.md) for full endpoint reference.

## 🧪 Test Credentials

After registering, use the role selector on the register page to create:
- **Admin account** — Full dashboard access
- **Sales account** — Limited access (view + update status)
