import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { holdSeatId, aircraftId } = req.body;

    if (!holdSeatId || !aircraftId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      const response = await fetch(process.env.GRAPHQL_ENDPOINT!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation ReleaseSeat($holdSeatId: String!, $aircraftId: String!) {
              releaseSeat(holdSeatId: $holdSeatId, aircraftId: $aircraftId)
            }
          `,
          variables: { holdSeatId, aircraftId },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(500).json({ error: 'Failed to release seat.' });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
