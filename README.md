# TaskFlow — Backend REST API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)

**Live API Base URL:** `https://taskflow-backend-qmna.onrender.com/api`  
**Frontend Repository:** [https://github.com/devbyshawon/taskflow-frontend](https://github.com/devbyshawon/taskflow-frontend)  
**Frontend Live Demo:** [https://taskflow-shawon.vercel.app](https://taskflow-shawon.vercel.app)

---

## About

This is the REST API backend for TaskFlow, a team project and task management application. Built with Node.js and Express, it provides secure endpoints for user authentication, project management, task management, and role-based member access control. Data is stored in MongoDB Atlas using Mongoose ODM.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework and routing |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM for schema modeling |
| JSON Web Tokens | Stateless authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |

---

## Project Structure

```
taskflow-backend/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Signup, login, getMe
│   ├── projectController.js # Project CRUD + member management
│   └── taskController.js   # Task CRUD
├── middleware/
│   └── auth.js             # JWT verification middleware
├── models/
│   ├── User.js             # User schema
│   ├── Project.js          # Project schema with members subdocument
│   └── Task.js             # Task schema
├── routes/
│   ├── authRoutes.js       # /api/auth routes
│   └── projectRoutes.js    # /api/projects and /api/tasks routes
├── .env                    # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js               # Entry point
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |
| GET | `/api/auth/me` | Get current authenticated user | Yes |

### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all projects user is a member of | Yes |
| POST | `/api/projects` | Create a new project | Yes |
| GET | `/api/projects/:id` | Get a single project by ID | Yes (Member) |
| PUT | `/api/projects/:id` | Update project name/description | Yes (Admin) |
| DELETE | `/api/projects/:id` | Delete a project | Yes (Admin) |
| POST | `/api/projects/:id/members` | Add a member by email | Yes (Admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove a member | Yes (Admin) |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects/:id/tasks` | Get all tasks for a project | Yes (Member) |
| POST | `/api/projects/:id/tasks` | Create a new task | Yes (Member) |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes (Admin) |

---

## Authentication

This API uses **JWT (JSON Web Token)** based authentication.

**How it works:**
1. User registers via `POST /api/auth/signup`
2. User logs in via `POST /api/auth/login` and receives a JWT token
3. Token is included in the `Authorization` header for all protected routes:
```
Authorization: Bearer <your_jwt_token>
```
4. The `protect` middleware verifies the token and attaches the user to `req.user`

**Token expiry:** 7 days

---

## Role-Based Access Control

Projects have two member roles:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access — create/edit/delete tasks, manage members, edit/delete project |
| **Member** | Can view all tasks, update status of tasks assigned to them |

The project creator is automatically assigned the **admin** role.

---

## Data Models

### User
```
name: String (required)
email: String (required, unique)
password: String (required, hashed with bcrypt)
createdAt: Date
```

### Project
```
name: String (required)
description: String
owner: ObjectId (ref: User)
members: [{ user: ObjectId (ref: User), role: 'admin' | 'member' }]
createdAt: Date
```

### Task
```
title: String (required)
description: String
status: 'todo' | 'in-progress' | 'done' (default: 'todo')
project: ObjectId (ref: Project)
assignedTo: ObjectId (ref: User)
dueDate: Date
createdAt: Date
```

---

## Local Setup

**1. Clone the repository:**
```bash
git clone https://github.com/devbyshawon/taskflow-backend
cd taskflow-backend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create a `.env` file in the root directory:**
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key
```

**4. Start the server:**
```bash
node server.js
```

Server runs on `http://localhost:5001`

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes |

---

## Deployment

This API is deployed on **Render** (free tier).

- Auto-deploys on every push to the `main` branch
- Free tier has a cold start delay of ~30 seconds after inactivity
- MongoDB Atlas is configured with `0.0.0.0/0` IP whitelist for Render's dynamic IPs

---

## Author

**MD. Shawon Hossain (Arham)**  
Final-year CSE Student, BRAC University  
[GitHub](https://github.com/devbyshawon) · [LinkedIn](https://linkedin.com/in/devbyshawon)
