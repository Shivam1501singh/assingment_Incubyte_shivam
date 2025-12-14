# 🍬 Sweet Shop Management System

A full-stack inventory and sales management system for a sweet shop, built as part of the **Incubyte TDD Kata Assignment**. This project simulates real-world backend + frontend workflows with authentication, inventory control, purchase flow, and a modern UI.

---

## 📌 Project Overview

This application manages sweets inventory and sales with secure authentication and role-based access. It demonstrates REST API design, database integration, frontend state management, and responsible AI-assisted development.

---

## ✨ Core Capabilities

### 🔐 Authentication & Authorization

* JWT-based user registration & login
* Role-based access control (**Admin**, **Staff**)
* Protected backend APIs

### 📦 Inventory Management

* View all available sweets
* Search & filter by name, category, or price range
* Admin-only add, update, delete, and restock functionality
* Real-time stock updates after purchase/restock

### 🛒 Cart & Purchase Flow

* Add / remove sweets from cart
* Quantity validation against available stock
* Purchase API decreases inventory safely
* Purchase disabled when stock is zero

### 🎨 Modern UI

* Responsive dashboard layout
* Built with **React + TypeScript**
* Styled using **shadcn/ui** and **Tailwind CSS**

---

## 🧱 Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Axios
* JWT Decode

### Backend

* Node.js
* Express
* MongoDB with Mongoose
* JWT Authentication
* RESTful APIs

---

## 🚀 Local Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shivam1501singh/assingment_Incubyte_shivam.git
cd assingment_Incubyte_shivam
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend server:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔑 Roles & Access Control

### 👑 Admin

* Add, update, delete sweets
* Restock inventory
* View full inventory

### 👨‍🍳 Staff

* View sweets
* Add items to cart
* Purchase sweets
* Cannot restock or delete items

---

## 📸 Screenshots

*Add screenshots after running the project and upload them to the repository.*

```
/screenshots/login.png
/screenshots/dashboard.png
/screenshots/cart.png
/screenshots/restock.png
```

Usage in README:

```md
![Dashboard](screenshots/dashboard.png)
```

---

## 🧪 Testing & TDD

* Backend developed following **Test-Driven Development (TDD)**
* Clear Red → Green → Refactor workflow
* Unit and integration tests for services and APIs
* Meaningful test cases for edge conditions (out-of-stock, auth failure, role checks)

---

## 🤖 My AI Usage

### AI Usage Policy (Transparency)

AI tools were actively used during development as **assistive tools**, in line with modern software engineering practices. Their usage was transparent, controlled, and always reviewed manually.

### AI Tools Used

* **GitHub Copilot** – for syntax auto-completion and small code suggestions
* **Lovable AI** – for minor UI layout and interface inspiration

### How AI Was Used

* Auto-completing repetitive syntax and boilerplate code
* Speeding up React + TypeScript development
* Assisting with minor UI structure and layout ideas
* Helping identify and fix small bugs during development

### What AI Did NOT Do

* Did not design the system architecture
* Did not write full features independently
* Did not make final decisions or business logic
* Did not replace manual problem-solving or understanding

All AI-assisted code was **carefully reviewed, modified, and integrated manually** before being committed.

### AI Co-authorship in Git Commits

For every commit where AI assistance was used, the AI tool was added as a co-author in the commit message, following the required format:

```bash
git commit -m "feat: Implement user registration endpoint

Used an AI assistant to generate initial boilerplate and syntax suggestions,
then manually added validation logic and business rules.

Co-authored-by: GitHub Copilot <copilot@users.noreply.github.com>"
```

This ensures full transparency and compliance with the **Incubyte AI Usage Policy**.

---

## 📈 Future Improvements

* Persist cart using `localStorage`
* Add admin sales analytics dashboard
* Pagination for large inventories
* Dockerization and cloud deployment (AWS / Vercel)

---

## 🧑‍💻 Author

**Shivam Singh**
Computer Science Engineer
Full Stack Developer

---

## 📄 License

This project is developed for educational and assessment purposes.
