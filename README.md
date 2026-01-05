# Math Practice App - MERN Stack

A full-stack math practice application built with MongoDB, Express, React, and Node.js.

## Phase 1: Authentication ✓

Basic authentication system with user registration and login.

## Project Structure

```
MathApp/
├── server/                 # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js        # JWT authentication
│   ├── models/
│   │   └── User.js        # User schema
│   ├── routes/
│   │   └── auth.js        # Auth routes
│   ├── .env               # Environment variables
│   └── server.js          # Express server
│
└── client/                # Frontend (React + Vite)
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Practice.jsx
    │   ├── services/
    │   │   ├── api.js     # Axios instance
    │   │   └── auth.js    # Auth service
    │   └── App.jsx        # Router setup
    └── .env               # Vite environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

Backend `.env` file is already configured at `server/.env`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `CLAUDE_API_KEY` - Claude API key (for future features)

Frontend `.env` file is configured at `client/.env`:
- `VITE_API_URL` - Backend API URL (http://localhost:5000)

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/me` - Get current user (requires auth token)

## Features Implemented

### Backend
- ✓ User model with password hashing (bcryptjs)
- ✓ MongoDB connection with error handling
- ✓ JWT authentication middleware
- ✓ Auth controller with register/login/getCurrentUser
- ✓ Auth routes
- ✓ Express server with CORS configuration
- ✓ Global error handling

### Frontend
- ✓ Axios API instance with request/response interceptors
- ✓ Auth service with token management
- ✓ Register page with validation
- ✓ Login page with validation
- ✓ Protected routes component
- ✓ Router setup with authentication checks
- ✓ Practice page (placeholder for future features)

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected routes on both frontend and backend
- Automatic token attachment to API requests
- Token validation on protected endpoints
- CORS configuration for localhost development

## Next Steps

Phase 2 will include:
- Math problem generation using Claude API
- User progress tracking
- Practice session management
- Statistics and analytics

## Testing

You can test the authentication flow:

1. Navigate to http://localhost:5173
2. Click "Sign up here" to create an account
3. Fill in username, email, and password
4. After registration, you'll be redirected to /practice
5. Click "Logout" to test the login flow

## License

ISC
