# Neuroleancing

Neuroleancing is a modern, full-stack web application designed for a freelancing platform. It connects freelancers with clients, allowing users to post jobs, submit proposals, manage projects, and communicate seamlessly.

## Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Visuals:** Three.js & React Three Fiber (@react-three/fiber, @react-three/drei)
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Testing:** Vitest & React Testing Library

### Backend
- **Framework:** Node.js with Express 5
- **Database:** PostgreSQL (via Sequelize ORM)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Testing:** Jest & Supertest

## Project Structure

```
neuroleancing_WEB/
├── backend/neuroleancing_backend/      # Express API, Sequelize Models, Controllers, Routes
└── frontend/neuroleancing_frontend/    # React frontend, Components, Pages, Context, 3D Scenes
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/neuroleancing_backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the backend directory based on `.env.example` (if available) or include your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=neuroleancing
   JWT_SECRET=your_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/neuroleancing_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file and set the API base URL (if needed):
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Features
- **User Authentication:** Secure login and registration with JWT.
- **Role-Based Access:** Distinct workflows for Freelancers and Clients.
- **Project Management:** Post new jobs, view project details, and manage ongoing work.
- **Proposals:** Submit proposals for open jobs and manage applied jobs.
- **Interactive UI:** Smooth animations with Framer Motion and 3D visual experiences with Three.js.
- **Responsive Design:** fully responsive layouts built with Tailwind CSS.

## License

This project is licensed under the MIT License.
