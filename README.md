# 🍽️ Food Hygiene Inspection and Reporting Platform

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green) ![Frontend](https://img.shields.io/badge/Frontend-EJS%20%2B%20React-blue) ![Database](https://img.shields.io/badge/Database-MySQL-orange)

---

## 🔍 Overview

The **Food Hygiene Inspection and Reporting Platform** is a full-stack web application that digitizes the entire food safety inspection lifecycle — from restaurant registration and scheduled inspections to hygiene scoring and public reporting.

The platform serves **four roles**: Super Admin, Admin, Inspector, and Public User — each with their own portal and dedicated features.

---

## 🌐 Live Demo

> 🚧 Coming soon — deployment in progress.

---

## 💡 Why I Built This

Traditional food hygiene inspection systems are paper-based, slow, and opaque to the public. This platform solves that by:

- Digitizing inspection checklists and automating hygiene scoring
- Enabling zone-based admin and inspector management
- Giving the public real-time access to restaurant hygiene reports
- Supporting image evidence uploads directly from inspections
- Providing a built-in AI chatbot for FSSAI-related queries

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Super Admin** | Manages all zone admins across the system |
| **Admin** | Manages inspectors, restaurants, and reports in their zone |
| **Inspector** | Adds restaurants, conducts inspections, submits reports |
| **Public User** | Views approved restaurants, hygiene scores, files complaints |

---

## ⚙️ Features

### 🛡️ Super Admin
- Login with hardcoded secure credentials
- Add, edit, delete zone admins
- Monitor admin count across zones

### 👨‍💼 Admin
- Zone-based dashboard with stats
- Approve or reject restaurants submitted by inspectors
- Assign inspectors to restaurants for scheduled inspections
- Review and approve/reject inspection reports
- Download inspection reports as PDF

### 🔍 Inspector
- Add restaurants with license details and images
- View scheduled inspections for the day
- Conduct hygiene checklist-based inspections
- Upload photo evidence (via Cloudinary)
- Auto-calculated hygiene score (0–5 scale)
- View past inspection reports

### 🙋 Public User
- Register and login
- Browse approved restaurants by zone/region
- View detailed hygiene reports and scores
- Add restaurants to favourites
- File complaints with image evidence
- AI Chatbot (FSSAI Assistant) for food safety queries

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express.js |
| **Templating** | EJS (Server-Side Rendering) |
| **Frontend (Chatbot)** | React + Vite |
| **Database** | MySQL (mysql2) |
| **Image Storage** | Cloudinary |
| **Authentication** | express-session |
| **PDF Generation** | Puppeteer / html-pdf |
| **AI Chatbot** | Groq SDK (Gemini 2.5 Flash) |

---

## 📸 Screenshots

### 🏠 Home Page
<!-- Add screenshot here -->
![Home Page](screenshots/home.png)

### 🔐 Login Pages
<!-- Admin Login -->
![Admin Login](screenshots/admin_login.png)

<!-- Inspector Login -->
![Inspector Login](screenshots/inspector_login.png)

<!-- User Login -->
![User Login](screenshots/user_login.png)

### 📊 Admin Dashboard
<!-- Add screenshot here -->
![Admin Dashboard](screenshots/admin_dashboard.png)

### 🔍 Inspector Dashboard
<!-- Add screenshot here -->
![Inspector Dashboard](screenshots/inspector_dashboard.png)

### 📋 Inspection Checklist
<!-- Add screenshot here -->
![Inspection Form](screenshots/inspection_form.png)

### 📄 Inspection Report
<!-- Add screenshot here -->
![Inspection Report](screenshots/report_view.png)

### 🙋 User Dashboard
<!-- Add screenshot here -->
![User Dashboard](screenshots/user_dashboard.png)

### 🤖 AI Chatbot (FSSAI Assistant)
<!-- Add screenshot here -->
![Chatbot](screenshots/chatbot.png)

---

## 🗄️ Database Schema

Key tables:
- `admins` — zone-based admin accounts
- `inspectors` — inspector accounts per zone/region
- `restaurants` — restaurant records with approval status
- `inspections` — scheduled inspection records
- `inspection_reports` — hygiene reports with JSON checklist data
- `users` — public user accounts
- `complaints` — user-filed complaints with image evidence
- `favorites` — user's favourite restaurants

> Full schema: [`data/schema.sql`](data/schema.sql)

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MySQL (local or cloud)
- Cloudinary account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/Sadikcserymec077/Food-Hygiene-and-Inspection-platform.git
cd Food-Hygiene-and-Inspection-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=food_hygiene_db

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Set up MySQL database

Create the database and run the schema:
```sql
CREATE DATABASE food_hygiene_db;
```
Then run all SQL from [`data/schema.sql`](data/schema.sql) in MySQL Workbench.

### 5. Start the backend
```bash
npm run dev
```
> Server runs at `http://localhost:5000`

### 6. Start the React frontend (Chatbot UI)
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

---

## 🔐 Default Login Credentials

| Role | URL | Email | Password |
|---|---|---|---|
| Super Admin | `/superadmin/login` | `superadmin@gmail.com` | `pass123` |
| Admin | `/adminLogin` | *(created by Super Admin)* | *(set by Super Admin)* |
| Inspector | `/inspectorLogin` | *(created by Admin)* | *(set by Admin)* |
| User | `/userSignup` | *(self-register)* | — |

---

## 🔒 Security Notes

- Passwords are stored in plaintext (for demo purposes) — hash with bcrypt before production use
- Session secret should be moved to `.env` in production
- Cloudinary credentials must never be committed to Git (already in `.gitignore`)

---

## 🏗️ Architecture

```
Public User / Admin / Inspector / Super Admin
            ↓
    Express.js Server (port 5000)
            ↓
   EJS Templates + REST Routes
            ↓
    MySQL Database (mysql2)
            ↓
   Cloudinary (image storage)
            ↓
    Groq AI (chatbot responses)
```

---

## 👨‍💻 Author

**Mohammed Sadiq**  
Full Stack Developer

---

## 📄 License

MIT License — feel free to use and modify for educational purposes.