import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:3300/graphql';

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
    } catch (error: any) {
      console.error('Error in CancelTicketByOne mutation:', error);
      res.status(500).json({ message: 'Error canceling the ticket', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

