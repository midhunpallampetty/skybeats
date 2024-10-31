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
      const response = await fetch('http://localhost:3300/graphql', {           
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
    } catch (error: any) {
      console.error('Fetch error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
