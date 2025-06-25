import jwt from 'jsonwebtoken';
import User from '../models/User.js';

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set in environment variables. Using default secret for development.');
}

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
}; 