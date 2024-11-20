import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

// Initialize the GraphQL Client pointing to your server
const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

// GraphQL Query for fetching seats
const GET_SEATS_QUERY = gql`
  query GetSeats($flightNumber: String!, $flightModel: String!) {
    getSeats(flightNumber: $flightNumber, flightModel: $flightModel) {
      _id
      aircraftID
      class
      col
      isBooked
      row
      x
      y
    }
  }
`;

// API handler for fetching seats
const getSeats = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Destructure flightNumber and flightModel from request body
    const { flightNumber, flightModel } = req.body;
    console.log('Received flightNumber:', flightNumber, 'Received flightModel:', flightModel);

    try {
      // Prepare variables for the GraphQL query
      const variables = { flightNumber, flightModel };
      console.log('Fetching seat data from GraphQL API');
      
      // Execute the GraphQL request
      const data: any = await graphQLClient.request(GET_SEATS_QUERY, variables);
      console.log('Received GraphQL response:');

      // Return the seat data
      res.status(200).json(data.getSeats);
    } catch (error: any) {
      // Handle errors by sending appropriate response
      console.error('Error fetching seats:', error.response ? error.response.errors : error.message);
      res.status(500).json({ message: 'Error fetching seats', error: error.response ? error.response.errors : error.message });
    }
  } else {
    // If the method is not POST, return 405 Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default getSeats;
