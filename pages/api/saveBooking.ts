import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = process.env.GRAPHQL_ENDPOINT!;

const client = new GraphQLClient(endpoint);

const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      passengerName
      email
      phoneNumber
      departureAirport
      arrivalAirport
      stop
      flightNumber
      flightDuration
      departureTime
      arrivalTime
      totalPassengers
      FarePaid
      DateofJourney
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const bookingInput = req.body;

    try {
      const variables = { input: bookingInput };
      const data = await client.request(CREATE_BOOKING_MUTATION, variables);
      res.status(200).json(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle the error if it's an instance of Error
        res.status(500).json({ message: 'Error creating booking', error: error.message });
      } else {
        // If the error is not an instance of Error, send a generic message
        res.status(500).json({ message: 'Error creating booking', error: 'Unknown error' });
      }
    }
    
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
