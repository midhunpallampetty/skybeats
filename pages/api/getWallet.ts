import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const getBookingByUserId = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.body; 
   console.log(userId,'cgsdcgsdhcgv');
    if (!userId) {
        return res.status(400).json({ msg: 'User ID is required' });
    }

    const graphQLClient = new GraphQLClient('https://ringtail-amazing-shepherd.ngrok-free.app/graphql');

    // Define the updated GraphQL query with variables
    const query = gql`
      query getWalletDetails($userId: ID!) {
        getWalletDetails(userId: $userId) {
       walletBalance
        }
      }
    `;

    try {
        // Make a request with the userId passed as a variable
        const data: any = await graphQLClient.request(query, { userId });

        const walletBalance = data.getWalletDetails;

        console.log('Data received from GraphQL:', walletBalance);

        return res.status(200).json(walletBalance);
    } catch (error) {
        console.log('GraphQL server error:', error);
        return res.status(500).json({ msg: 'Error receiving data' });
    }
};

export default getBookingByUserId;
