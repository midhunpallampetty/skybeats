import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const searchHotel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { city } = req.body;

  const graphQLClient = new GraphQLClient('http://localhost:3300/graphql'); // Your GraphQL endpoint
  const query = gql`
    query HotelByLocation($city: String!) {
      HotelByLocation(city: $city) {
       amenities
      check_in_time
      check_out_time 
      essential_info
      excluded_amenities
      gps_coordinates {
        latitude
        longitude
      }
      images {
        description
        url
      }
      location_rating
      name
      nearby_places {
        distance
        name
      }
      overall_rating
      prices {
        amount
        currency
      }
      }
    }
  `;

  try {
    const variables = {city:city };

    const data = await graphQLClient.request(query,variables);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Error fetching hotels' });
  }
};

export default searchHotel;
