import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';
const getCargo = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');
    const query = gql`
    query getRequests{
    getRequests{
    approved
    Date_Received
    descriptionOfGoods
    packageName
    receiverName
    senderName
    trackingId
    Weight
    }
    
    
    }
    `;
    try {
        const data: any = await graphQLClient.request(query);
        const cargo: String[] = data.getRequests;

        console.log('data received from gql', cargo);
        return res.status(200).json(cargo);
    } catch (error) {
        console.log('gql server error');
        res.status(500).json({ msg: 'Error receiving data' });
    }
};
export default getCargo;