import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';
import { Flight } from '../../interfaces/flight';

const searchFlights = async (req: NextApiRequest, res: NextApiResponse) => {
  const { from, to } = req.body;
  console.log('Received request body:', req.body);

  const graphQLClient = new GraphQLClient('https://skybeats.neptunemusics.shop/graphql');

  const query = gql`
    query SearchFlights($from: String!, $to: String!) {
      searchFlights(from: $from, to: $to) {
        airline
        flightNumber
        departureTime
        departureAirport
        arrivalTime
        arrivalAirport
        duration
        stops
        price
      }
    }
  `;

  try {
    const variables = { from, to };
    console.log('Sending GraphQL request with variables:', variables);

    const data: any = await graphQLClient.request(query, variables);
    console.log('Received GraphQL response:', data);

    const flights: Flight[] = data.searchFlights;
    res.status(200).json(flights);
  } catch (error:any) {
    console.error('Error searching flights:', error.message);
    res.status(500).json({ message: 'Error searching flights' });
  }
};

export default searchFlights;
