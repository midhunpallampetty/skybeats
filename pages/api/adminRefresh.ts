// /pages/api/refresh-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT!, // Set your GraphQL API endpoint here
  cache: new InMemoryCache(),
});

// GraphQL mutation for refreshing token
const REFRESH_TOKEN_MUTATION = gql`
  mutation adminrefreshToken($adminrefreshToken: String!) {
    adminrefreshToken(adminrefreshToken: $adminrefreshToken) {
     adminaccessToken
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { adminrefreshToken } = req.body;
    // Check if refresh token is provided
    if (!adminrefreshToken) {
      return res.status(400).json({ message: 'No refresh token provided' });
    }

    try {
      // Call GraphQL mutation to refresh tokens
      const { data } = await client.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: { adminrefreshToken },
      });

      const { adminaccessToken } = data.adminrefreshToken;

      

      // Respond with the new tokens
      res.status(200).json({ adminaccessToken });
    } catch (error: any) {
      console.error('Refresh Token Error:', error.message);
      res.status(401).json({ message: 'Failed to refresh token', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
