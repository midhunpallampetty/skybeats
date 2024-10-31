import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';
const getBookings = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');
    const query = gql`
    query getAllBooking{
    getAllBooking{
    arrivalAirport
    arrivalTime
    departureAirport
    email
    FarePaid
    flightDuration
    flightNumber
    passengerName
    phoneNumber
    stop
    ticketUrl 
    }
    
    
    }
    `;
    try {
        const data: any = await graphQLClient.request(query);
        const bookings: String[] = data.getAllBooking;

        console.log('data received from gql', bookings);
        return res.status(200).json(bookings);
    } catch (error) {
        console.log('gql server error');
        res.status(500).json({ msg: 'Error receiving data' });
    }
};
export default getBookings;