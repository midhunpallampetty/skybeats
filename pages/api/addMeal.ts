// pages/api/addMeal.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { hotOrCold, ImageUrl, itemName, stock ,price} = req.body;

    // Log to debug the incoming request body
    console.log('Request body:', req.body);
console.log(hotOrCold, ImageUrl, itemName, stock,price);
    // Ensure all fields are present
    if (!hotOrCold || !ImageUrl || !itemName || stock === undefined || price ===undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const response = await fetch(process.env.GRAPHQL_ENDPOINT!, {           
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation addFoodItems($input: FoodInput!) {
              addFoodItems(input: $input) {
                hotOrCold
                ImageUrl
                itemName
                stock
                price
              }
            }
          `,
          variables: {
            input: {
              hotOrCold,
              ImageUrl,
              itemName,
              stock,
              price
            },
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return res.status(200).json({ success: true, data });
      } else {
        console.error('GraphQL error:', data.errors);
        return res.status(500).json({ error: data.errors || 'Failed to add meal' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fetch error:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown fetch error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    }
    
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
