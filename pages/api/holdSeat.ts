import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { holdSeatIds, aircraftId, sessionId, userId } = req.body;

    // Validate the required fields
    if (!Array.isArray(holdSeatIds) || holdSeatIds.length === 0 || !aircraftId || !sessionId || !userId) {
      return res.status(400).json({ success: false, error: 'Missing or invalid required fields.' });
    }

    try {
      // GraphQL mutation payload
      const mutation = `
        mutation HoldSeats($holdSeatIds: [String!]!, $aircraftId: String!, $sessionId: String!, $userId: String!) {
          holdSeats(holdSeatIds: $holdSeatIds, aircraftId: $aircraftId, sessionId: $sessionId, userId: $userId) {
            holdSeatId
            aircraftId
            userId
            sessionId
            status
          }
        }
      `;

      // Send the mutation request to the GraphQL server
      const response = await fetch(process.env.GRAPHQL_ENDPOINT!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: mutation,
          variables: { holdSeatIds, aircraftId, sessionId, userId },
        }),
      });

      const data = await response.json();

      // Handle successful response from GraphQL server
      if (response.ok && data?.data?.holdSeats) {
        return res.status(200).json({ success: true, data: data.data.holdSeats });
      } else {
        // Handle errors from GraphQL response
        const errorMessage = data.errors?.[0]?.message || 'Failed to hold the seats.';
        console.error('GraphQL Error:', data.errors);
        return res.status(400).json({ success: false, error: errorMessage });
      }
    } catch (error: any) {
      // Handle unexpected server errors
      console.error('Internal Server Error:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
