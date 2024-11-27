import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// GraphQL mutation for verifying OTP
const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    verifyOtp(email: $email, otp: $otp) {
      accessToken
      refreshToken
      user {
        id
        username
        email
      }
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

  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }

  try {
    // Execute the mutation
    const { data } = await apolloClient.mutate({
      mutation: VERIFY_OTP_MUTATION,
      variables: { email, otp },
    });

    // Ensure the response structure matches expectations
    if (!data || !data.verifyOtp) {
      throw new Error('Invalid response from server.');
    }

    const { accessToken, refreshToken, user } = data.verifyOtp;
    console.log(accessToken, refreshToken, user.id,'ghcfgfg')
    // Return the tokens and user data on successful verification
    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);

    // Differentiate error types if possible
    const errorMessage = error.message || 'Failed to verify OTP';
    const statusCode = error.networkError ? 503 : 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
}
