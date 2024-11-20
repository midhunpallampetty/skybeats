import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const getBookingByUserId = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.body; 
   console.log(userId,'cgsdcgsdhcgv');
    if (!userId) {
        return res.status(400).json({ msg: 'User ID is required' });
    }

    const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

    // Define the updated GraphQL query with variables
    const query = gql`
      query getBookingById($userId: ID!) {
        getBookingById(userId: $userId) {
        arrivalAirport
    arrivalTime
    DateofJourney
    departureAirport
    departureTime
    createdAt
    email
    cancelled
    FarePaid
    flightDuration
    flightModel
    flightNumber
    id
    passengerName {
      age
      disability
      firstName
      lastName
      middleName
      passportNumber
      
    }
      ticketUrls
      cancelledSeats
      seatNumber
        }
      }
    `;

    try {
        // Make a request with the userId passed as a variable
        const data: any = await graphQLClient.request(query, { userId });

        const booking = data.getBookingById;

        console.log('Data received from GraphQL:', booking);

        return res.status(200).json(booking);
    } catch (error) {
        console.log('GraphQL server error:', error);
        return res.status(500).json({ msg: 'Error receiving data' });
    }
};

export default getBookingByUserId;
