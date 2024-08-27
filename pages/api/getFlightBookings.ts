import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient, gql } from "graphql-request";

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');

    const query = gql`
        query getAllHotelBooking {
            getAllHotelBooking {
                email
                guestName
                phoneNumber
            }
        }
    `;

    try {
        const data: any = await graphQLClient.request(query);

        const bookings: String[] = data.getAllHotelBooking;
        res.status(200).json(bookings);
    } catch (error: any) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export default getUsers;
