import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest,NextApiResponse } from 'next';
const client = new ApolloClient({
  uri: 'https://skybeats.neptunemusics.shop/graphql', // Set your GraphQL API endpoint here
  cache: new InMemoryCache(),
});

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const SIGNIN_MUTATION = gql`
    mutation userLogin($email: String!, $password: String!) {
      userLogin(email: $email, password: $password) {
        token
        user {
          email
          isBlocked
          id
        }
      }
    }
  `;

  try {
    const { data } = await client.mutate({
      mutation: SIGNIN_MUTATION,
      variables: { email, password },
    });

    res.status(200).json({
      token: data.userLogin.token,
      user: data.userLogin.user,
    });
  } catch (error:any) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
