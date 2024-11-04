import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'https://skybeats.neptunemusics.shop/graphql';

const client = new GraphQLClient(endpoint);

const SAVE_IMAGE_MUTATION = gql`
  mutation SaveImage($input: CloudInput!) {
    SaveImage(input: $input) {
     imageUrl
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const CloudInput = req.body;
    
    try {
      const variables = { input: CloudInput };
      const data = await client.request(SAVE_IMAGE_MUTATION, variables);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
