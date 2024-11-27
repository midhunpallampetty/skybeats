import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { holdSeatId, aircraftId } = req.body;

        // Input validation
        if (!holdSeatId || !aircraftId) {
            return res.status(400).json({ error: 'Missing required parameters: holdSeatId or aircraftId' });
        }

        try {
            // GraphQL query to check seat availability
            const response = await axios.post(process.env.GRAPHQL_ENDPOINT || '', {
                query: `
                    query CheckSeat($holdSeatId: String!, $aircraftId: String!) {
                        checkSeat(holdSeatId: $holdSeatId, aircraftId: $aircraftId)
                    }
                `,
                variables: { holdSeatId, aircraftId },
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            // Handle GraphQL errors
            if (data.errors) {
                console.error('GraphQL Errors:', data.errors);
                return res.status(400).json({ error: data.errors[0].message });
            }

            // Extract and return response
            const isHeld = data.data.checkSeat;
            return res.status(200).json({ isHeld });
        } catch (error: any) {
            console.error('Error checking seat availability:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Handle unsupported methods
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
