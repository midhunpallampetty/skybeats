import { NextApiRequest, NextApiResponse } from 'next';
import { AirPort } from 'airport-nodejs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const airports = await AirPort.getAllAirports();
    res.status(200).json(airports);
  } catch (error) {
    console.error('Error fetchingddwdwdwd bustop:', error);
    res.status(500).json({ message: 'Error fetching airports' });
  }
};
