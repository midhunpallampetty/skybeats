import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

// Initialize the GraphQL Client pointing to your server
const graphQLClient = new GraphQLClient('https://skybeats.neptunemusics.shop/graphql');

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
const getApplications = async (req: NextApiRequest, res: NextApiResponse) => {
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
    } catch (error: any) {
      // Handle errors by sending an appropriate response
      console.error('Error fetching applications:', error.response ? error.response.errors : error.message);
      res.status(500).json({ message: 'Error fetching applications', error: error.response ? error.response.errors : error.message });
    }
  } else {
    // If the method is not POST, return 405 Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default getApplications;
