import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

// Protect routes - authentication middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    // Only check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and ensure they exist
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid or has expired',
        });
      }

      // Check if token was issued before password change
      const tokenIssuedAt = decoded.iat;
      if (user.passwordChangedAt && tokenIssuedAt < user.passwordChangedAt.getTime() / 1000) {
        return res.status(401).json({
          success: false,
          message: 'Password was changed. Please login again',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again',
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please login again',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Please login again',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Verify email middleware
export const verifyEmail = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email to access this resource',
    });
  }
  next();
};

// Admin middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};