import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT!, 
  cache: new InMemoryCache(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  const CHECK_SEAT_MUTATION = gql`
    mutation($input: CheckSeatInput!) {
      checkSeat(input: $input)
    }
  `;

  try {
    const { data } = await client.mutate({
      mutation: CHECK_SEAT_MUTATION,
      variables: { input },
    });

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error checking seat:', error);
    res.status(500).json({ error: 'An error occurred while checking the seat.' });
  }
}
