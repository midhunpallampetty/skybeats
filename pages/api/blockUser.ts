import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:3300/graphql';

const client = new GraphQLClient(endpoint);

const BLOCK_USER_MUTATION = gql`
  mutation blockUser($blockUserId: String!) {
    blockUser(id: $blockUserId) {
      message
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { blockUserId } = req.body;  // Extracting the id directly from the request body
    console.log(req.body,'bhdcbhdcbdhc');
    try {
      const variables = { blockUserId };  // Passing the id directly in the variables
      const data = await client.request(BLOCK_USER_MUTATION, variables);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: 'Error blocking/unblocking user', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
