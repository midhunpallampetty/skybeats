import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { id, oldpassword, newpassword } = req.body;
console.log(req.body)
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
    const response = await fetch('https://skybeats.neptunemusics.shop/graphql', {
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

    if (json.errors) {
      return res.status(400).json({ message: json.errors[0].message });
    }

    const { status, message } = json.data.changePassword;

    return res.status(status).json({ message });
  } catch (error) {
    console.error('Error making GraphQL request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
