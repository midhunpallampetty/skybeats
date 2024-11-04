// /pages/api/toggleApproval.ts
import { NextApiRequest, NextApiResponse } from 'next';

const TOGGLE_APPROVAL_MUTATION = `
  mutation ToggleApprovalStatus($trackingId: String!) {
    toggleApprovalStatus(trackingId: $trackingId) {
      trackingId
      approved
      Date_Received
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { trackingId } = req.body; // The tracking ID should come in the request body.

  if (!trackingId) {
    return res.status(400).json({ error: 'Tracking ID is required' });
  }

  try {
    const response = await fetch('https://skybeats.neptunemusics.shop/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: TOGGLE_APPROVAL_MUTATION,
        variables: { trackingId },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      return res.status(500).json({ error: result.errors[0].message });
    }

    return res.status(200).json(result.data.toggleApprovalStatus);
  } catch (error) {
    console.error('Error in API request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
