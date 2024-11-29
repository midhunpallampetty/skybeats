import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

// Initialize the GraphQL Client pointing to your server
const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

// GraphQL Query for fetching a random seat
const GET_RANDOM_SEAT = gql`
  query getRandomSeat($flightModel: String!) {
    getRandomSeat(flightModel: $flightModel) {
      class
      col
      row
      seatId
    }
  }
`;

const getRandomSeat = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { flightModel } = req.body;

    if (!flightModel) {
      return res.status(400).json({ message: 'Flight model is required.' });
    }

    try {
      const variables = { flightModel };

      console.log('Fetching random seat for flight model:', flightModel);
      
      const data = await graphQLClient.request(GET_RANDOM_SEAT, variables);

      console.log('Received GraphQL response:', data);

      // Return the seat data from the GraphQL response
      res.status(200).json(data.getRandomSeat);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching random seat:', error.message);
        res.status(500).json({
          message: 'Error fetching random seat',
          error: error.message,
        });
      } else if (error && typeof error === 'object' && 'response' in error) {
        const e = error as { response?: { errors: string } };
        console.error('Error fetching random seat:', e.response?.errors || 'Unknown error');
        res.status(500).json({
          message: 'Error fetching random seat',
          error: e.response?.errors || 'Unknown error',
        });
      } else {
        console.error('Unknown error fetching random seat:', error);
        res.status(500).json({
          message: 'Error fetching random seat',
          error: 'Unknown error',
        });
      }
    }
    
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default getRandomSeat;
