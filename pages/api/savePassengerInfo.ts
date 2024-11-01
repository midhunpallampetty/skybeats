import { NextApiRequest, NextApiResponse } from 'next';
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:3300/graphql';
const client = new GraphQLClient(endpoint);

const SAVE_PASSENGER_INFO_MUTATION = gql`
  mutation savePassengerInfo($input: savePassengerInfo!) {
    savePassengerInfo(input: $input) {
    email
    lastUsed
    _id
    firstName,
    lastName,
    middleName,
    passportNumber
    phone
    userId
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const passengerInput = req.body.input;
console.log(req.body.input)
    try {
      const variables = { input: passengerInput };
      const data = await client.request(SAVE_PASSENGER_INFO_MUTATION, variables);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: 'Error saving passenger information', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
