import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3300/graphql', 
  cache: new InMemoryCache(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'Input is required' });
  }

  // Updated mutation to include arrivalTime and email
  const CANCEL_FLIGHT_MUTATION = gql`
    mutation($bookingId: String!) {
      CancelTicketById(BookingId: $bookingId) {
        arrivalTime
        email
      }
    }
  `;

  try {
    // Perform the mutation with the bookingId variable
    const { data } = await client.mutate({
      mutation: CANCEL_FLIGHT_MUTATION,
      variables: { bookingId },
    });

    // Respond with the mutation result
    res.status(200).json(data.CancelTicketById);
  } catch (error: any) {
    console.error('Error cancelling ticket:', error);
    res.status(500).json({ error: 'An error occurred while cancelling the ticket.' });
  }
}
