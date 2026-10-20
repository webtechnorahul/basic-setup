# Authentication API

A Node.js + Express authentication backend built for user registration, login, profile retrieval, password reset, and Google OAuth login.

## Overview

This project provides a REST API for managing user authentication in a scalable backend setup. It uses:

- Express.js for the API server
- MongoDB with Mongoose for data persistence
- JWT for token-based authentication
- bcryptjs for password hashing
- Google OAuth 2.0 for social login
- Cookie-based session token storage

## Features

- User registration with validation
- User login with username or email
- JWT authentication via cookie
- Fetch current authenticated user (`/get-me`)
- Password reset via email + mobile verification
- Google login flow
- Error handling middleware for API responses

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Passport.js
- Google OAuth 2.0
- dotenv

## Project Structure

```text
authentication/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── config.js
│       │   └── database.js
│       ├── controller/
│       │   └── auth.controller.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── model/
│       │   └── auth.model.js
│       ├── routes/
│       │   └── auth.routes.js
│       └── validation/
│           └── auth.validation.js
├── frontend/
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string
- Google OAuth credentials (Client ID and Client Secret)

## Setup

1. Open a terminal in the project root.
2. Go to the backend folder:

```bash
cd backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the `backend` folder with the following values:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://localhost:27017/authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

5. Start the server:

```bash
npm run dev
```

The server will run on the port defined in `PORT` (default: `3000`).

## API Endpoints

### Base URL

```text
http://localhost:3000/api/auth
```

### 1) Register User

```http
POST /api/auth/register
```

Request body:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "John@1234"
}
```

Response:

```json
{
  "message": "user register successfull",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "profileImg": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Notes:
- A JWT token is generated and stored in a cookie named `token`.
- Username and email must be unique.

### 2) Login User

```http
POST /api/auth/login
```

You can log in using either `email` or `username`.

Request body:

```json
{
  "email": "john@example.com",
  "password": "John@1234"
}
```

or

```json
{
  "username": "john_doe",
  "password": "John@1234"
}
```

Response:

```json
{
  "message": "login successfully",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 3) Get Current User

```http
GET /api/auth/get-me
```

Requires a valid JWT token in the cookie.

Response:

```json
{
  "message": "user found",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 4) Forgot Password / Reset Password

```http
PATCH /api/auth/forget-password
```

Request body:

```json
{
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "NewPass@123",
  "confirmPassword": "NewPass@123"
}
```

Response:

```json
{
  "message": "reset password successfull"
}
```

### 5) Google Login

```http
GET /api/auth/google
```

This starts the Google authentication flow.

Callback route:

```http
GET /api/auth/google/callback
```

After successful login, the user is redirected to:

```text
/api/auth/dashboard
```

## Validation Rules

The API validates input before processing requests.

### Registration
- Username: minimum 3 characters, alphanumeric and underscore only
- Email: valid email
- Mobile: 10 digits
- Password: minimum 8 characters, at least 1 number and 1 uppercase letter

### Login
- Must provide either email or username
- Password must meet the same validation rules

## Authentication Flow

1. User registers or logs in.
2. Backend verifies credentials.
3. JWT is generated using the user ID.
4. Token is saved in a cookie.
5. Protected routes use the middleware to verify the token.
6. User details are returned from the authenticated request.

## Error Handling

The API returns JSON errors using a middleware at the application level.

Example error response:

```json
{
  "success": false,
  "error": "incorrect password"
}
```

Common errors include:
- unauthorized access
- user not found
- incorrect password
- username already exist
- user already register
- password not match

## Notes

- This backend is primarily designed for authentication APIs and is ready to be connected to a frontend application.
- Google login configuration must be set correctly in the `.env` file.
- The project is structured in a modular way so routes, controllers, validation, and models can be extended easily.

## License

This project is currently unlicensed and intended for learning or internal use unless otherwise specified.
