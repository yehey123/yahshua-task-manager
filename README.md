# Task Manager Web App

A full-stack Task Manager application built with Django REST Framework (Backend) and React.js (Frontend) for the Software Development Operational Test.

## Objective
Build a Task Manager Web App that allows users to:
- View a list of tasks
- Create a new task
- Update an existing task
- Mark a task as completed
- Delete a task

---

## Project Structure
- `/backend/` -> Django project (REST API)
- `/frontend/` -> React project (Vite + Tailwind CSS)
- `Makefile` -> Root automation for both frontend and backend

---

## Getting Started

### Prerequisites
- Python 3.13
- Node.js 24
- `make` (optional but recommended)
- `docker` and `docker-compose` (for production/containerized setup)

### Fast Track (using Makefile)
If you have `make` installed, you can set up the entire project with these commands:

1. **Install all dependencies**:
   ```bash
   make install
   ```
2. **Build and migrate**:
   ```bash
   make build
   ```
3. **Start both servers**:
   ```bash
   make start
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8000`

---

## Manual Setup

### Backend (Django)
1. Navigate to the backend directory: `cd backend`
2. Ensure python version is 3.13
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React)
1. Navigate to the frontend directory: `cd frontend`
2. Ensure you are using the right node version (24).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks/` | List all tasks |
| POST | `/tasks/` | Create a new task |
| GET | `/tasks/{id}/` | Retrieve a task by ID |
| PUT | `/tasks/{id}/` | Update a task (title & description) |
| PATCH | `/tasks/{id}/` | Toggle task completed status |
| DELETE | `/tasks/{id}/` | Delete a task |

---

## Makefile Commands

### Root Makefile
- `make install`: Install both backend and frontend dependencies.
- `make build`: Build frontend and run backend migrations.
- `make start`: Run both development servers concurrently.
- `make up-prod`: Run the stack using Docker Compose.

### Backend Makefile
- `make lint`: Run `ruff` linter.
- `make format`: Run `ruff` formatter.
- `make compile`: Re-compile `requirements.in` to `requirements.txt`.

### Frontend Makefile
- `make test`: Run frontend tests.
- `make build`: Build the production-ready frontend bundle.

---

## Docker Support

You can run the entire stack using Docker Compose:
```bash
make up-prod
```
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`

To stop the containers:
```bash
make down-prod
```

---

## Technical Details & Assumptions
- **Backend Stack**: Django + Django REST Framework using `viewsets.ViewSet`.
- **Frontend Stack**: React.js with Hooks, Axios for API calls, and Tailwind CSS for styling (Shadcn UI components).
- **Database**: SQLite (default Django configuration).
- **Testing**: Frontend includes unit tests (Vitest).
- **Assumptions**: 
    - The API expects JSON payloads for POST, PUT, and PATCH requests.
    - CORS is configured to allow requests from the frontend development server.
    - UI includes basic loading states and error messages via Toasts.
