import { NextApiRequest, NextApiResponse } from 'next';

const AIRPORT_DATA_URL = 'https://airline-datace.s3.ap-south-1.amazonaws.com/airport-city.txt'; // Replace with actual CDN URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch(AIRPORT_DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch airport data. Status: ${response.status}`);
    }
    const airports = await response.json();
    res.status(200).json(airports);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching airports:', error.message, error.stack);
      res.status(500).json({ message: 'Error fetching airports' });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Error fetching airports' });
    }
  }
  
};
