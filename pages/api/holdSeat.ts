import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from "next";

const client = new ApolloClient({
  uri: 'http://localhost:3300/graphql',
  cache: new InMemoryCache(),
});

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    console.log('coach is here',req.body)
    const { input } = req.body;
   console.log(input,'freffsef')
    const HOLD_SEAT_MUTATION = gql`
      mutation($input: CheckSeatInput!) {
        holdSeat(input: $input) {
          aircraftId
          holdSeatId
          userId
        }
      }
    `;

    try {
      const { data } = await client.mutate({
        mutation: HOLD_SEAT_MUTATION,
        variables: { input },
      });

      res.status(200).json(data.holdSeat);
    } catch (error) {
      console.error('Error holding seat:', error);
      res.status(500).json({ error: 'An error occurred while holding the seat.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
