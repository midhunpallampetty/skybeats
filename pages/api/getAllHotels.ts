import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

// Initialize the GraphQL Client
const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

// GraphQL Query for listing all hotels
const LIST_ALL_HOTELS = gql`
  query {
    listAllHotels {
      amount
      cancelled
      checkin
      checkout
      createdAt
      email
      guestName
      hotelLocation
      hotelName
      id
      noOfGuests
      phoneNumber
      userId
    }
  }
`;

// API handler for listing all hotels
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching hotel data...');

      // Execute the GraphQL query
      const data = await graphQLClient.request(LIST_ALL_HOTELS);

      console.log('GraphQL response received:', data);

      // Respond with the fetched hotel data
      res.status(200).json(data.listAllHotels);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Log and respond with error details
        console.error('Error fetching hotels:', error.message);
        res.status(500).json({ message: 'Error fetching hotels', error: error.message });
      } else {
        // Handle unknown errors
        console.error('Unknown error:', error);
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  } else {
    // Respond with 405 Method Not Allowed for unsupported HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
