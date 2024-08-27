import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:3300/graphql';

const client = new GraphQLClient(endpoint);

const CREATE_HOTEL_BOOKING_MUTATION = gql`
  mutation CreateBooking($input: hotelBookingInput!) {
    createHotelBooking(input: $input) {
      guestName
      email
      phoneNumber
      
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const bookingInput = req.body;
  console.log(bookingInput)
    try {
      const variables = { input: bookingInput };
      const data = await client.request(CREATE_HOTEL_BOOKING_MUTATION, variables);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
