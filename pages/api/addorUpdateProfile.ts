
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Create a new Apollo Client instance
const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT!, // Your GraphQL server URL
  cache: new InMemoryCache(),
});

// Define the ProfileInput type based on the input structure
type ProfileDTO = {
  userId: string;
  gender?: string;
  contactNo?: string;
  currentAddress?: string;
  permananentAddress?: string;
  email?: string;
  birthday?: string;
};

const ADD_OR_UPDATE_PROFILE = gql`
  mutation($input: ProfileInput!) {
    addorUpdateProfile(input: $input) {
      userId
      gender
      contactNo
      currentAddress
      permananentAddress
      email
      birthday
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
console.log(req.body,'haifwff');
  try {
    const input: ProfileDTO = req.body; // Get input from request body
    const { data } = await client.mutate({
      mutation: ADD_OR_UPDATE_PROFILE,                                                               
      variables: { input },
    });

    return res.status(200).json(data.addorUpdateProfile);
  } catch (error) {
    console.error('Error in addOrUpdateProfile API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
