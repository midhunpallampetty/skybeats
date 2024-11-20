import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = process.env.GRAPHQL_ENDPOINT!;
const client = new GraphQLClient(endpoint);

const CREATE_CAREER_MUTATION = gql`
  mutation createJob($input: JobInput!) {
    createJob(input: $input) { 
      designation
      description
      Image
      salary
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const careerInput = req.body;  // Career input from the request body
    console.log(careerInput);  // Log for debugging

    try {
      // Pass the input data as GraphQL variables
      const variables = { input: careerInput };
      console.log(variables);  // Log for debugging

      const data = await client.request(CREATE_CAREER_MUTATION, variables);
      
      // Return the response data
      res.status(200).json(data);
    } catch (error: any) {
      // Catch any errors and send an appropriate message
      console.error('GraphQL error:', error.response || error);
      res.status(500).json({ message: 'Error creating job', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
