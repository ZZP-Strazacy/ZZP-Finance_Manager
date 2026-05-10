# Finance Manager

A simple web application for tracking personal expenses. Users can add, edit, and delete expenses, filter them by category or date, and view monthly summaries broken down by category.

## Tech stack

- **Frontend:** React, Bootstrap CSS
- **Backend:** Spring Boot (Java 21)
- **Storage:** Browser cookies / localStorage (no database)

## Features

- Add, edit, and delete expenses (amount, category, date, description)
- Filter expenses by category and date range
- Monthly expense summary
- Category breakdown view

## Project structure

```
ZZP-Finance_Manager/
├── frontend/    # React app (Vite)
├── backend/     # Spring Boot app
└── docker-compose.yml
```

## Running locally

### Prerequisites
- Node.js 20+
- Java 21
- Maven

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`

### Backend

```bash
cd backend
JAVA_HOME=$(/usr/libexec/java_home -v 21) mvn spring-boot:run
```

API available at `http://localhost:8080`

## Running with Docker

### Prerequisites
- Docker
- Docker Compose

### Start the full stack

```bash
docker compose up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:8080`

### Stop

```bash
docker compose down
```
