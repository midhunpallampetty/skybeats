import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';
const GetCloudImages = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient('https://skybeats.neptunemusics.shop/graphql');
    const query = gql`
    query getJobs{
    getJobs{
       description
       designation
       Image
    }
    }
    `;
    try {
        const data: any = await graphQLClient.request(query);
       

        console.log('data received from gql', data);
        return res.status(200).json(data);
    } catch (error) {
        console.log('gql server error');
        res.status(500).json({ msg: 'Error receiving data' });
    }
};

export default GetCloudImages;