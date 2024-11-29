import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';
import authenticateToken from './middleware/authenticateToken'; // Adjust the path based on your file structure

// Initialize the GraphQL Client pointing to your server
const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

// GraphQL Query for fetching applications by userId
const GET_APPLIED = gql`
  query getApplicationsById($userId: String!) {
    getApplicationsById(userId: $userId) {
      coverLetter
      createdAt
      cv
      Date
      email
      name
      phone
      userId
    }
  }
`;

// API handler for fetching applications
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Destructure userId from request body
    const { userId } = req.body;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      // Prepare variables for the GraphQL query
      const variables = { userId };

      console.log('Fetching application data from GraphQL API for userId:', userId);

      // Execute the GraphQL request
      const data: any = await graphQLClient.request(GET_APPLIED, variables);

      console.log('Received GraphQL response:', data);

      // Return the application data
      res.status(200).json(data.getApplicationsById);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If the error is an instance of Error, log and respond with the message
        console.error('Error fetching applications:', error.message);
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
      } else if (error && (error as { response?: { errors?: any } }).response) {
        // If the error contains a response object with errors
        console.error('Error fetching applications:', (error as { response: { errors: any } }).response.errors);
        res.status(500).json({
          message: 'Error fetching applications',
          error: (error as { response: { errors: any } }).response.errors,
        });
      } else {
        // Handle unknown error cases
        console.error('Unknown error:', error);
        res.status(500).json({ message: 'Error fetching applications', error: 'Unknown error' });
      }
    }
  } else {
    // If the method is not POST, return 405 Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default async function getApplications(req: NextApiRequest, res: NextApiResponse) {
  // Apply the middleware before executing the handler
  await authenticateToken(req, res, async () => {
    await handler(req, res);
  });
}
