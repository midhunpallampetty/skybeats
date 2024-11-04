import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';
interface Application {
  coverLetter: string;
  cv: string;
  email: string;
  name: string;
  phone: string;
  Date: string;
}

interface GetAllApplicationsResponse {
  getAllApplication: Application[];
}

// Define the GraphQL query
const GET_ALL_APPLICATIONS = gql`
  query getAllApplication {
    getAllApplication {
      coverLetter
      cv
      email
      name
      phone
      Date
    }
  }
`;

// Create the API handler
const getAllApplications = async (req: NextApiRequest, res: NextApiResponse) => {
  // Initialize the GraphQL client, replace with your GraphQL server URL
  const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');

  try {
    // Make the request to the GraphQL API
    const data = await graphQLClient.request<GetAllApplicationsResponse>(GET_ALL_APPLICATIONS);

    // Ensure the data contains the applications
    const applications = data?.getAllApplication || [];

    // Return the applications data as JSON
    return res.status(200).json({ success: true, applications });
  } catch (error: any) {
    console.error('Error fetching applications:', error.message);

    // Return a 500 error if something goes wrong
    return res.status(500).json({ success: false, message: 'Error fetching applications', error: error.message });
  }
};

export default getAllApplications;
