# 🍽️ FoodHub – Restaurant Backend API

A scalable and secure **RESTful backend API** for a restaurant web application built using **Node.js, Express, TypeScript, and MongoDB**, following a **feature-based MVC architecture**.

This backend is designed for real-world usage and academic submission, with clean code separation, validation, authentication, and role-based access control.

---

## ✨ Features

- 🔐 Authentication & Authorization (JWT)
- 👤 Role-based access control (Admin / User)
- 🔑 Password hashing with bcrypt
- ✅ Request validation using Zod
- 🍔 Food / Product management (CRUD)
- 📦 Order management
- 🏠 Address management (delivery support)
- 🧩 Feature-based modular architecture
- 🧠 Type-safe codebase with TypeScript
- 🌱 Environment-based configuration

---

## 🏗️ Architecture (Feature-Based MVC)

This project follows **MVC principles** organized in a **feature-based structure**.

Each feature contains its own:

- Routes
- Controllers
- Services (business logic)
- Models (Mongoose schemas)
- Validations (Zod)
- Middlewares (if required)

This approach improves **scalability, readability, and maintainability**.

---

## 📂 Project Folder Structure

```
Backend/
└── src/
├── @types/
│ ├── admin.type.ts
│ ├── food.type.ts
│ ├── order.type.ts
│ └── user.type.ts
│
├── config/
│ └── mongodb.ts
│
├── features/
│ ├── admin/
│ │ ├── admin.routes.ts
│ │ ├── admin.controller.ts
│ │ ├── admin.service.ts
│ │ ├── admin.model.ts
│ │ ├── admin.validation.ts
│ │ └── admin.middleware.ts
│ │
│ ├── auth/
│ │ ├── auth.routes.ts
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.validation.ts
│ │ └── auth.middleware.ts
│ │
│ ├── foods/
│ │ ├── food.routes.ts
│ │ ├── food.controller.ts
│ │ ├── food.service.ts
│ │ ├── food.model.ts
│ │ └── food.validation.ts
│ │
│ ├── orders/
│ │ ├── order.routes.ts
│ │ ├── order.controller.ts
│ │ ├── order.service.ts
│ │ ├── order.model.ts
│ │ └── order.validation.ts
│ │
│ ├── users/
│ │ ├── user.routes.ts
│ │ ├── user.controller.ts
│ │ ├── user.service.ts
│ │ ├── user.model.ts
│ │ └── user.validation.ts
│ │
│ └── address/
│ ├── address.routes.ts
│ ├── address.controller.ts
│ ├── address.service.ts
│ ├── address.model.ts
│ └── address.validation.ts
│
├── utils/
│ ├── bcrypt.ts
│ └── jwt.ts
│
├── app.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore

```
---

## ⚙️ Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- Zod (validation)
- JWT (authentication)
- bcrypt (password hashing)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation
```bash
npm install

npm run dev

http://localhost:3000
```
## 🔐 Environment Variables

- Create a .env file in the root directory:

🔐 Environment Variables

Create a .env file in the root directory:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```

