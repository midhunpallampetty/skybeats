import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

// Initialize the GraphQL Client pointing to your server
const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

// GraphQL Query to fetch the list of foods
const LIST_FOODS = gql`
  query {
    listFoods {
      hotOrCold
      ImageUrl
      itemName
      stock
      createdAt
    }
  }
`;

// API handler for fetching the list of foods
const getFoods = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      console.log('Fetching food data from GraphQL API...');
      
      // Execute the GraphQL request
      const data: any = await graphQLClient.request(LIST_FOODS);

      console.log('Received GraphQL response:', data);

      // Return the food data
      res.status(200).json(data.listFoods);
    } catch (error: any) {
      // Handle errors by sending an appropriate response
      console.error(
        'Error fetching food data:',
        error.response ? error.response.errors : error.message
      );
      res.status(500).json({
        message: 'Error fetching food data',
        error: error.response ? error.response.errors : error.message,
      });
    }
  } else {
    // If the method is not GET, return 405 Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default getFoods;
