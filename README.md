# E-Commerce Product Management System

A full-stack authentication system with user registration, login, password management, and protected dashboard.

## 🚀 Features

### Authentication & Security
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ HttpOnly cookies for token storage
- ✅ Protected API routes with middleware
- ✅ Email verification stub (console output)
- ✅ Forgot password flow with reset tokens
- ✅ Input sanitization and validation

### Frontend Features
- ✅ Real-time form validation
- ✅ Inline error messages
- ✅ Password strength indicator
- ✅ Responsive design
- ✅ Loading states and user feedback
- ✅ Automatic redirect to dashboard on login

### Backend Features
- ✅ RESTful API with Express
- ✅ MongoDB with Mongoose ODM
- ✅ Unique email and username constraints
- ✅ Database indexes for performance
- ✅ Comprehensive error handling
- ✅ CORS configuration for security

## 📋 Requirements Met

| Requirement | Implementation | Status |
|------------|----------------|--------|
| Registration Page | Full Name, Email, Username, Password, Confirm Password fields | ✅ |
| Login Page | Username/Email + Password | ✅ |
| Client Validation | Required fields, email format, password rules (8+ chars, upper, lower, digit) | ✅ |
| Inline Validation | Real-time error messages on blur and submit | ✅ |
| Backend Endpoints | `/api/auth/register`, `/api/auth/login` | ✅ |
| Password Hashing | bcrypt with 12 salt rounds | ✅ |
| Unique Constraints | Email and username uniqueness enforced | ✅ |
| JWT Authentication | Access tokens with HttpOnly cookies | ✅ |
| Protected Route | `/api/dashboard` returns user info | ✅ |
| MongoDB Schema | Users collection with all required fields | ✅ |
| Database Indexes | Indexes on email and username | ✅ |
| Forgot Password | Token generation with console email output | ✅ |
| Email Verification | Stub implementation with console output | ✅ |
| Dashboard Redirect | Auto redirect after successful login | ✅ |

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- express-validator (validation)
- cookie-parser
- cors

### Frontend
- React 18
- Vite (build tool)
- React Router v6
- Axios (HTTP client)
- CSS3 (custom styling)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```powershell
git clone <repository-url>
cd ecommerce-product-management
```

### 2. Backend Setup
```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example or use the provided .env)
# Edit .env with your configuration

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```powershell
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example or use the provided .env)

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Database Setup

**Option A: Local MongoDB**
```powershell
# Install MongoDB from https://www.mongodb.com/try/download/community
# Start MongoDB service
mongod

# Database and indexes will be created automatically on first run
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

## 🧪 Testing

### Test User Credentials

After registration, you can use these test accounts:

**Test User 1:**
- Username: `testuser`
- Email: `test@example.com`
- Password: `Test1234`

**Test User 2:**
- Username: `johndoe`
- Email: `john@example.com`
- Password: `SecurePass123`

### Sample API Requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "SecurePass123",
    "confirm_password": "SecurePass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "johndoe",
    "password": "SecurePass123"
  }'
```

**Dashboard (Protected):**
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Forgot Password:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

## 🚀 Deployment

### Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up/Login

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
````
   Name: ecommerce-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start