// pages/api/cargoBooking.js
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest,NextApiResponse } from 'next';
// Define the Apollo Client that connects to the GraphQL server
const client = new ApolloClient({
  uri: 'http://localhost:3300/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Extract the input from the request body
      const { packageName, senderName, receiverName, descriptionOfGoods,Weight,userId,height,width,StartLocation,Destination } = req.body;

      // Send the GraphQL mutation request
      const { data } = await client.mutate({
        mutation: gql`
          mutation requestCargo($input: CargoInput!) {
            requestCargo(input: $input) {
              packageName
              senderName
              receiverName
              descriptionOfGoods
             
              trackingId,
              
            }
          }
        `,
        variables: {
          input: {
            packageName,
              senderName,
              receiverName,
              descriptionOfGoods,
              Weight,
              userId,
              height,
              width,
              StartLocation,
              Destination
              
          },
        },
      });
      console.log("Mutation variables:", packageName,
        senderName,
        receiverName,
        descriptionOfGoods,
        Weight,
        userId,
        height,
        width,
        StartLocation,
        Destination);

      // Send the response back with the data
      res.status(200).json(data.requestCargo);
    } catch (error) {
      console.error("Error in GraphQL mutation", error);
      res.status(500).json({ message: 'Error processing cargo booking request' });
    }
  } else {
    // Return an error if not POST request
    res.status(405).json({ message: 'Method not allowed' });
  }
}
