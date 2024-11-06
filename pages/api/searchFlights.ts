import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';
import { Flight } from '../../interfaces/flight';

const searchFlights = async (req: NextApiRequest, res: NextApiResponse) => {
  const { from, to } = req.body;

  const graphQLClient = new GraphQLClient('https://ringtail-amazing-shepherd.ngrok-free.app/graphql');

  const query = gql`
    query searchFlights($fromAirport: String!, $toAirport: String!) {
      searchFlights(fromAirport: $fromAirport, toAirport: $toAirport) {
    airline
    arrivalAirport
    departureAirport
    arrivalTime
    departureTime
    duration
    price
    stops
    flightNumber

      }
    }
  `;

  console.log(from, to);

  try {
                                                                                                                                                                                        const variables = { fromAirport: from, toAirport: to };
    const data: any = await graphQLClient.request(query, variables);
    const flights: Flight[] = data.searchFlights;

    res.status(200).json(flights);
  } catch (error: any) {
    console.error('Error searching flights:', error.response ? error.response.errors : error.message);
    res.status(500).json({ message: 'Error searching flights' });
  }
};

export default searchFlights;
