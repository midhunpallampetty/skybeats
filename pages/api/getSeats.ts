import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');

const GET_SEATS_QUERY = gql`
query GetSeats($flightNumber: String!) {
    getSeats(flightNumber: $flightNumber) {
        _id
        aircraftID
        class
        col
        isBooked
        row
        x
        y
    }
}
`;

const getSeats = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { flightNumber } = req.body; // Ensure you're getting the flightNumber from the body
        console.log('Received flightNumber:', flightNumber);

        try {
            const variables = { flightNumber };
            console.log('Fetching data from backend for getting seats');
            const data: any = await graphQLClient.request(GET_SEATS_QUERY, variables);
            console.log('Received GraphQL response:', data);

            res.status(200).json(data.getSeats); 
        } catch (error: any) {
            console.error('Error fetching seats:', error.response ? error.response.errors : error.message);
            res.status(500).json({ message: 'Error fetching seats', error: error.response ? error.response.errors : error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' }); 
    }
};

export default getSeats;
