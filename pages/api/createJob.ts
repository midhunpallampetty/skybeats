import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'https://skybeats.neptunemusics.shop/graphql';
const client = new GraphQLClient(endpoint);

const CREATE_CAREER_MUTATION = gql`
  mutation createJob($input: JobInput!) {
    createJob(input: $input) { 
      designation,
      description,
      Image,
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const careerInput = req.body;

    try {
      const variables = { input: careerInput };
      const data = await client.request(CREATE_CAREER_MUTATION, variables);
      res.status(200).json(data);
    } catch (error: any) {
      console.error('GraphQL error:', error.response || error); 
      res.status(500).json({ message: 'Error creating job', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
