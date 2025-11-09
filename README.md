# E-Commerce Product Management System

A full-stack e-commerce product management application built with React, Node.js, Express, and MongoDB. This application allows users to register, login, manage products, and process orders.

## 🚀 Live Demo

- **Frontend:** [https://ecommerce-product-management-frontend.onrender.com](https://ecommerce-product-management-frontend.onrender.com)
- **Backend API:** [https://ecommerce-product-management-backend.onrender.com](https://ecommerce-product-management-backend.onrender.com)

## 📋 Features

### User Authentication
- User registration with validation
- Secure login/logout functionality
- JWT-based authentication
- Protected routes and middleware

### Product Management
- Create, read, update, and delete products
- Product listing with shop view
- Product details view
- Role-based access control

### Order Management
- Create and manage orders
- Order history tracking
- User-specific order views

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Security headers (XSS protection, nosniff, frame options)
- Input validation with express-validator

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling (if applicable)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **cookie-parser** - Cookie parsing
- **cors** - Cross-origin resource sharing

## 📁 Project Structure

```
ecommerce-product-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   └── orders.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PaulEbenezer454/Ecommerce-Product-Management.git
   cd Ecommerce-Product-Management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Create backend environment file**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

2. **Create frontend environment file**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Configure the service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=your_frontend_render_url
   PORT=5000
   ```

4. **Deploy**

### Frontend Deployment (Render)

1. **Create a new Static Site on Render**
2. **Configure the service:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install; npm run build`
   - **Start Command:** `npm start`

3. **Add Environment Variables:**
   ```
   VITE_API_URL=your_backend_render_url/api
   ```

4. **Update vite.config.js:**
   ```javascript
   preview: {
     allowedHosts: ['your-frontend-app.onrender.com']
   }
   ```

5. **Deploy**

## 🔑 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Product Routes
- `GET /api/products` - Get all products (Protected)
- `GET /api/products/shop` - Get shop products
- `GET /api/products/:id` - Get single product (Protected)
- `POST /api/products` - Create product (Protected)
- `PUT /api/products/:id` - Update product (Protected)
- `DELETE /api/products/:id` - Delete product (Protected)

### Order Routes
- `GET /api/orders` - Get all orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create order (Protected)

### Health Check
- `GET /api/health` - Server health check

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Test Health Endpoint
```bash
curl https://ecommerce-product-management-backend.onrender.com/api/health
```

### Test Registration
```bash
curl -X POST https://ecommerce-product-management-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

## 🐛 Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure `FRONTEND_URL` is set correctly in backend `.env`
- Check CORS configuration in `server.js`

**2. MongoDB Connection Failed**
- Verify MongoDB connection string
- Check if IP address is whitelisted in MongoDB Atlas
- Ensure network access is configured properly

**3. Routes Not Found (404)**
- Verify root directory is set correctly in Render
- Check that all route files are properly exported
- Ensure routes are mounted correctly in `server.js`

**4. Environment Variables Not Loading**
- Restart development server after changing `.env`
- Verify `.env` file is in the correct directory
- For Vite, variables must start with `VITE_`
- Check Render environment variables are set correctly

**5. Build Failures**
- Clear build cache in Render
- Check for syntax errors
- Verify all dependencies are in `package.json`

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Paul Ebenezer**
- GitHub: [@PaulEbenezer454](https://github.com/PaulEbenezer454)
- Email: paulebenezer@karunya.edu.in

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email paulebenezer@karunya.edu.in or open an issue in the GitHub repository.

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Render for deployment platform
- Express.js community for excellent documentation
- React team for the amazing frontend library