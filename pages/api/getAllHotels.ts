import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT!, // Replace with your actual GraphQL API URI
  cache: new InMemoryCache(),
});

// GraphQL Query for listing all hotels
const LIST_ALL_HOTELS = gql`
  query ListAllHotels {
    listAllHotels {
      id
      hotelName
      hotelLocation
      guestName
      email
      phoneNumber
      checkin
      checkout
      noOfGuests
      amount
      cancelled
      createdAt
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching all hotels...');

      // Execute the GraphQL query
      const { data } = await client.query({
        query: LIST_ALL_HOTELS,
      });

      // Ensure data is properly structured
      const hotels = data.listAllHotels || [];

      console.log('Fetched hotels:', hotels);

      // Respond with the fetched hotel data
      res.status(200).json({ success: true, data: hotels });
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Log the error and respond with details
        console.error('Error fetching hotels:', error.message);
        res.status(500).json({
          success: false,
          message: 'An error occurred while fetching hotel data.',
          details: error.message,
        });
      } else {
        console.error('Unexpected error:', error);
        res.status(500).json({
          success: false,
          message: 'An unexpected error occurred.',
        });
      }
    }
  } else {
    // Respond with 405 Method Not Allowed for unsupported HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed.`,
    });
  }
}
