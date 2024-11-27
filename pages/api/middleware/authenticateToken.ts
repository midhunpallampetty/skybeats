import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const authenticateToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    
    const response = await axios.post(
      '/api/validateToken', 
      { token }, 
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data?.isValid) {
      next(); // Proceed to the handler
    } else {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  } catch (error:any) {
    console.error('Error verifying token:', error.message);
    return res.status(500).json({ message: 'Internal server error during token verification' });
  }
};
