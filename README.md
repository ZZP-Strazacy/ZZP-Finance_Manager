# 💰 Finance Manager

> A lightweight web app for tracking personal expenses — add, edit, delete, filter, and summarize your spending with ease.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Bootstrap CSS |
| Backend | Spring Boot (Java 21) |
| Storage | Browser localStorage / cookies |

---

## ✨ Features

- ➕ Add, ✏️ edit, and 🗑️ delete expenses (amount, category, date, description)
- 🔍 Filter expenses by category and date range
- 📅 Monthly expense summary
- 📊 Category breakdown view

---

## 📁 Project Structure

```
ZZP-Finance_Manager/
├── frontend/          # React app (Vite)
├── backend/           # Spring Boot app
└── docker-compose.yml
```

---

## 🚀 Running Locally

### Prerequisites

- Node.js 20+
- Java 21
- Maven 3.9+

### Backend

```bash
cd backend
mvn spring-boot:run
```

API available at **http://localhost:8080**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at **http://localhost:5173**

> **Note:** When running locally, the frontend proxies API requests to the backend on port 8080. Make sure the backend is running before starting the frontend.

---

## 🐳 Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Start

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend | http://localhost:8080 |

### Stop

```bash
docker compose down
```

---

## 👥 Contributors

Made with ☕ by [ZZP-Strazacy](https://github.com/ZZP-Strazacy)