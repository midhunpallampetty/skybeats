import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';
const GetCloudImages = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);
    const query = gql`
    query getJobs{
    getJobs{
       description
       designation
       Image
       salary
       createdAt
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