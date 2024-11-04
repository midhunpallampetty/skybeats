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
      noOfGuests
      checkin
      checkout
      amount
      hotelLocation
      hotelName
      userId
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const bookingInput = req.body;
console.log(req.body)
      const variables = { input: bookingInput };
      const data = await client.request(CREATE_HOTEL_BOOKING_MUTATION, variables);

      res.status(200).json(data);
    } catch (error: any) {
      console.error('GraphQL Error:', error.response?.errors || error.message);
      res.status(500).json({
        message: 'Error creating booking',
        error: error.response?.errors || error.message,
      });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
