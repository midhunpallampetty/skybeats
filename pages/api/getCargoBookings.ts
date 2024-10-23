import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3300/graphql',
  cache: new InMemoryCache(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method === 'POST') {
    const { userId } = req.body;

    try {
      // Execute the GraphQL query
      const { data } = await client.query({
        query: gql`
          query getCargoByUser($userId: String!) {
            getCargoByUser(userId: $userId) {
              approved
              Date_Received
              descriptionOfGoods
              packageName
              receiverName
              rejected
              trackingId
            }
          }
        `,
        variables: { userId }, // Pass userId as a variable
      });

      // Send back the result as JSON
      res.status(200).json({ data: data.getCargoByUser });
    } catch (error) {
      console.error('Error fetching cargo details:', error);
      // Return a 500 status with error message
      res.status(500).json({ error: 'Error fetching cargo details' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
