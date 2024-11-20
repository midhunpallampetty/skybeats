import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = process.env.GRAPHQL_ENDPOINT!;
const client = new GraphQLClient(endpoint);

const GET_PASSENGER_INFO_QUERY = gql`
  query getPassengerInfo($userId: String!) {
    getPassengerInfo(userId: $userId) {
      email
      lastUsed
      firstName
      lastName
      middleName
      passportNumber
      phone
      userId
      age
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body; // Assuming `userId` is sent as part of the request body
    console.log(userId);

    try {
      const data = await client.request(GET_PASSENGER_INFO_QUERY, { userId });
      res.status(200).json(data);
    } catch (error: any) {
      console.error('Error fetching passenger info:', error);
      res.status(500).json({ message: 'Cannot find any saved details for this passenger'});
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
