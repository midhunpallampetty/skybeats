import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// GraphQL mutation for resetting password
const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
    }
  }
`;

// Initialize Apollo Client
const apolloClient = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT, // Ensure your GraphQL endpoint is set in .env
  cache: new InMemoryCache(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
  }

  const { token, newPassword } = req.body;

  // Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }

  try {
    // Execute the mutation
    const { data } = await apolloClient.mutate({
      mutation: RESET_PASSWORD_MUTATION,
      variables: { token, newPassword },
    });

    // Ensure the response structure matches expectations
    if (!data || !data.resetPassword) {
      throw new Error('Invalid response from server.');
    }

    const { message } = data.resetPassword;

    // Return success response
    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);

    // Differentiate error types if possible
    const errorMessage = error.message || 'Failed to reset password';
    const statusCode = error.networkError ? 503 : 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
}
