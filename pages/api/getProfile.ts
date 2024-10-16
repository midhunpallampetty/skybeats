// pages/api/profile.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

// Initialize GraphQL client
const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;

    console.log(req.body); // Log the request body for debugging

    // GraphQL query string
    const query = gql`
        query GetProfileDetails($userId: String!) {
            getProfileDetails(userId: $userId) {
    birthday
    currentAddress
    contactNo
    currentAddress
    permananentAddress
    gender
    userId   
    email        
            }
        }
    `;

    try {
        // Execute the GraphQL request with variables
        const data = await graphQLClient.request(query, { userId });

        // Send the response back with the GraphQL data
        return res.status(200).json(data);
    } catch (error) {
        console.error('GraphQL request error:', error);
        return res.status(500).json({ error: 'Error fetching profile details' });
    }
}
