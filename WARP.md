# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a student-centric freelance platform built with a React frontend (Vite) and Express backend, designed to connect students with freelance opportunities. The platform operates with dual user roles: students (freelancers) and clients (project posters).

## Tech Stack

### Frontend
- React 18 with Vite as build tool
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- ESLint for code quality

### Backend
- Express 5 server
- MongoDB with Mongoose ODM
- JWT authentication with jsonwebtoken
- bcryptjs for password hashing
- MySQL2 available (dual database setup)
- dotenv for environment configuration

## Development Commands

### Frontend (from `/frontend` directory)
```bash
# Start development server (runs on default Vite port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Backend (from `/backend` directory)
```bash
# Start server (no dev script configured - use node or nodemon manually)
node server.js

# For development with auto-reload (install nodemon first)
npx nodemon server.js
```

### Quick Start - Full Stack
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Architecture

### Route Structure
The application implements role-based routing with distinct paths for students and clients:

**Student Routes:**
- `/student/dashboard` - Main student dashboard
- `/student/profile` - Profile management
- `/student/applications` - View submitted applications
- `/student/active-projects` - Ongoing projects
- `/student/messages` - Communication center
- `/student/earnings` - Earnings tracking

**Client Routes:**
- `/client/dashboard` - Main client dashboard
- `/client/profile` - Profile management
- `/client/post-project` - Create new projects
- `/client/applications` - Review received applications
- `/client/messages` - Communication center

**Shared Routes:**
- `/projects` - Browse all projects
- `/project/:id` - Individual project details

### Backend Structure
- **server.js**: Express server entry point with MongoDB connection
- **auth.js**: Authentication routes (register/login) with JWT token generation
- **models/User.js**: Mongoose schema with role-based user model (student/client)

### Frontend Component Organization
- **components/**: Reusable UI components (Navbar, Footer, ProjectCard, StatsCard, DashboardLayout)
- **pages/**: Route-specific page components organized by user role
- **main.jsx**: Application entry with routing configuration
- **App.jsx**: Landing page component

## Key Implementation Details

### Authentication Flow
1. User registration stores hashed passwords using bcryptjs
2. Login generates JWT tokens with role information
3. Token includes user ID and role for authorization
4. Frontend stores token for authenticated API requests

### User Model
- Supports dual roles: "student" and "client"
- Students have skills array and rating system
- Email uniqueness enforced at database level

### Environment Variables
Backend requires `.env` file with:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (defaults to 5000)

## India-Specific Configuration

This application is focused on the Indian market. All currency displays should use:
- Currency symbol: ₹ (Indian Rupee)
- Number formatting: Indian numbering system (lakhs, crores)
- Date/time: IST (Indian Standard Time)
- Payment integrations should support Indian payment methods (UPI, etc.)

## Development Notes

### Missing Implementations
- No test suites configured yet
- Backend lacks dedicated route files beyond auth
- No middleware for protected routes
- Project, Application, and Message models not yet created
- CORS currently allows all origins (needs configuration for production)

### CSS Architecture
- Tailwind CSS configured with JIT mode
- Custom styles in index.css and output.css
- Component-specific styles use Tailwind utility classes

### Database Setup
- Primary database: MongoDB (Mongoose configured)
- MySQL2 installed but not actively used (possible future migration or dual-db setup)

## Common Tasks

### Adding New API Endpoints
1. Create route file in `/backend/routes/`
2. Define Mongoose model if needed in `/backend/models/`
3. Import and use route in server.js with `app.use()`
4. Update frontend API calls in relevant components

### Creating New Pages
1. Add component in `/frontend/src/pages/`
2. Add route in main.jsx Routes configuration
3. Update navigation components as needed
4. Ensure role-based access control if applicable

### Styling Updates
- Modify Tailwind config in `/frontend/tailwind.config.cjs`
- Run frontend dev server to see live updates
- Use Tailwind utility classes for consistency