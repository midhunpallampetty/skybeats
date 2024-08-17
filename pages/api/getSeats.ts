import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const getSeats = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');
    
    const query = gql`
        query GetSeats {
            getSeats {
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

    try {
        console.log('Fetching data from backend for getting seats');
        const data: any = await graphQLClient.request(query);
        console.log('Received GraphQL response:', data);

        // Adjust the response format if necessary
        res.status(200).json(data.getSeats);

    } catch (error: any) {
        console.error('Error fetching seats:', error.response ? error.response.errors : error.message);
        res.status(500).json({ message: 'Error fetching seats', error: error.response ? error.response.errors : error.message });
    }
};

export default getSeats;
