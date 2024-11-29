import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = process.env.GRAPHQL_ENDPOINT!;

const client = new GraphQLClient(endpoint);

const CANCEL_TICKET_BY_ONE = gql`
  mutation CancelTicketByOne($bookingId: String!, $seatNumber: String!) {
    CancelTicketByOne(BookingId: $bookingId, seatNumber: $seatNumber) {
     
      email
     
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { bookingId, seatNumber } = req.body;
  console.log(bookingId,seatNumber,' dscfsdc');
    try {
      const variables = { bookingId, seatNumber };
      const data:any = await client.request(CANCEL_TICKET_BY_ONE, variables);

      res.status(200).json(data.CancelTicketByOne);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error in CancelTicketByOne mutation:', error.message);
        res.status(500).json({
          message: 'Error canceling the ticket',
          error: error.message,
        });
      } else {
        console.error('Unexpected error in CancelTicketByOne mutation:', error);
        res.status(500).json({
          message: 'Error canceling the ticket',
          error: 'An unexpected error occurred.',
        });
      }
    }
    
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

