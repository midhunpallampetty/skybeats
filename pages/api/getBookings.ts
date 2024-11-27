import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const getBookings = async (req: NextApiRequest, res: NextApiResponse) => {
    const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

    // Define the GraphQL query with the required fields
    const query = gql`
        query GetAllBookings {
            getAllBooking {
                arrivalAirport
                arrivalTime
                DateofJourney
                email
                FarePaid
                flightDuration
                flightModel
                flightNumber
                phoneNumber
                createdAt
                  passengerName {
      age
      disability
      firstName
      lastName
      middleName
      passportNumber
    }
      stop
                
            }
        }
    `;

    try {
        // Define the expected structure of the response data
        const data = await graphQLClient.request<{ 
            getAllBooking: { 
                arrivalAirport: string;
                arrivalTime: string;
                DateofJourney: string;
                email: string;
                FarePaid: number;
                flightDuration: string;
                flightModel: string;
                flightNumber: string;
            }[] 
        }>(query);

        // Send the bookings data as a JSON response
        res.status(200).json(data.getAllBooking);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        
        // Handle errors gracefully by returning a 500 status code
        res.status(500).json({ message: 'Error fetching bookings', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export default getBookings;
