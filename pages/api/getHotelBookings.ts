import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

// Define a type for the hotel bookings
type HotelBooking = {
    email: string;
    guestName: string;
    phoneNumber: string;
    checkin: string;
    checkout: string;
    hotelLocation: string;
    hotelName: string;
    noOfGuests: number;
    createdAt: string;
    amount: number;
    userId: string;
    id: string;
    cancelled:boolean;
};

const getHotelBookings = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.body; // Extract userId from the request body

    if (!userId) {
        return res.status(400).json({ msg: 'userId is required' });
    }

    const graphQLClient = new GraphQLClient('https://skybeats.neptunemusics.shop/graphql');
    
    // Updated query to accept userId as a parameter
    const query = gql`
    query getAllHotelBooking($userId: String!) {
      getAllHotelBooking(userId: $userId) {
        email
        guestName
        phoneNumber
        checkin
        checkout
        hotelLocation
        hotelName
        noOfGuests
        createdAt
        amount
        userId
        id
        cancelled
      }
    }
    `;
    
    try {
        // Pass the userId to the GraphQL query
        const data = await graphQLClient.request<{ getAllHotelBooking: HotelBooking[] }>(query, { userId });
        const hotelBookings = data.getAllHotelBooking;

        console.log('Data received from gql:', hotelBookings);
        return res.status(200).json(hotelBookings);
    } catch (error: any) {
        console.error('GraphQL server error:', error.response || error.message || error);
        res.status(500).json({ msg: 'Error receiving data' });
    }
};

export default getHotelBookings;
