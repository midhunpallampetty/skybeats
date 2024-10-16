import { NextApiRequest, NextApiResponse } from 'next';

// Change password mutation handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { id, oldpassword, newpassword } = req.body;

  const mutation = `
    mutation ChangePassword($id: String!, $oldpassword: String!, $newpassword: String!) {
      changePassword(id: $id, oldpassword: $oldpassword, newpassword: $newpassword) {
        status
        message
      }
    }
  `;

  const variables = {
    id,
    oldpassword,
    newpassword,
  };

  try {
    // Send request to your backend GraphQL endpoint (adjust URL as needed)
    const response = await fetch('http://localhost:3300/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    });

    const json = await response.json();

    // If GraphQL returns an error
    if (json.errors) {
      return res.status(400).json({ message: json.errors[0].message });
    }

    // Retrieve status and message from GraphQL response
    const { status, message } = json.data.changePassword;

    // Send the appropriate status code and message
    return res.status(status).json({ message });
  } catch (error) {
    console.error('Error making GraphQL request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
