import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Clear the refresh token by setting it with maxAge: 0
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure in production
        sameSite: 'strict',
        path: '/',
        maxAge: 0, // Remove the cookie
      })
    );
    console.log("refreshToken Removed");
    res.status(200).json({ success: true, message: 'Refresh token removed.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
