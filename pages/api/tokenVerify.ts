import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

    const query = gql`
        query isAuthorised($token: String!) {
            isAuthorised(token: $token) {
                message
            }
        }
    `;

    try {
        const { token } = req.body;

        console.log('JSON TOKEN RECEIVED:', token);

        if (!token || typeof token !== 'string') {
            console.error('Invalid token format:', token);
            return res.status(400).json({ message: 'Token is required and must be a string' });
        }

        const variables = { token };
        console.log('type i',typeof variables);
        const data: any = await graphQLClient.request(query, variables);
        console.log('Received GraphQL response:', data.isAuthorised.message);

        res.status(200).json(data.isAuthorised.message);
    } catch (error: any) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

export default getUsers;
