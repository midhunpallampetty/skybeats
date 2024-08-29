import { NextApiRequest, NextApiResponse } from "next";
import { gql, GraphQLClient } from "graphql-request";

const getHotelBookings = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');
    
    const query = gql`
    query {
      getAllHotelBooking {
        email
        guestName
        phoneNumber
      }
    }
    `;
    
    try {
        const data: any = await graphQLClient.request(query);
        const Hotelbookings: String[] = data.getAllHotelBooking;

        console.log('data received from gql', Hotelbookings);
        return res.status(200).json(Hotelbookings);
    } catch (error) {
        console.log('gql server error', error);
        res.status(500).json({ msg: "Error receiving data" });
    }
}

export default getHotelBookings;
