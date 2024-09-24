import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';

const client = new ApolloClient({
  uri: 'http://localhost:3300/graphql',
  cache: new InMemoryCache(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { trackingId } = req.body;

    try {
      const { data } = await client.query({
        query: gql`
          query TrackCargo($trackingId: String!) {
            trackCargo(trackingId: $trackingId) {
                approved
                packageName
                Date_Received
                descriptionOfGoods
                 packageName
                rejected
                senderName
               
               Weight
            }
          }
        `,
        variables: { trackingId },
      });

      res.status(200).json({ data: data.trackCargo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching cargo details' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
