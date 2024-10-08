import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

// Define the GraphQL query as a string
const GET_AIRCRAFT_MODEL_QUERY = `
  query GetAircraftModel($flightNumber: String!) {
    getAircraftModel(flightNumber: $flightNumber) {
      aircraftDetails
    }
  }
`;

// Type for the response from GraphQL
interface AircraftModelResponse {
  data: {
    getAircraftModel: {
      aircraftDetails: string[];
    };
  };
  errors?: { message: string }[];
}

// Type for the request body (you can use this for better control and validation)
interface RequestBody {
  flightNumber: string;
}

// Main handler for the API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { flightNumber }: RequestBody = req.body;
console.log(req.body)
  // Validate if the flight number is provided
  if (!flightNumber) {
    return res.status(400).json({ error: 'Flight number is required' });
  }

  try {
    // Make a POST request to the GraphQL API with Axios
    const response = await axios.post(
      'http://localhost:3300/graphql', // Ensure this is your GraphQL server URL
      {
        query: GET_AIRCRAFT_MODEL_QUERY,
        variables: { flightNumber },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Handle GraphQL response and check for any errors
    const { data } = response;
    if (data.errors) {
      return res.status(500).json({ error: data.errors[0].message });
    }
console.log(data.data.getAircraftModel)
    // Send the aircraft details back in the response
    return res.status(200).json(data.data.getAircraftModel);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to fetch aircraft model' });
  }
}
