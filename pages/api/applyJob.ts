// pages/api/applyJob.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, phone, coverLetter, cv, userId, jobPost } = req.body;

    // Validate input
    if (!name || !email || !phone || !coverLetter || !cv || !userId || !jobPost) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Ensure the GraphQL endpoint is defined
    if (!process.env.GRAPHQL_ENDPOINT) {
      return res.status(500).json({ error: 'GraphQL endpoint is not configured.' });
    }

    try {
      // Make a request to your existing backend GraphQL API
      const response = await fetch(process.env.GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ApplyJob($input: ApplyJobInput!) {
              applyJob(input: $input) {
                name
                email
                phone
                coverLetter
                cv
              }
            }
          `,
          variables: {
            input: {
              name,
              email,
              phone,
              coverLetter,
              cv,
              userId,
              jobPost,
            },
          },
        }),
      });

      // Parse the response from the backend
      const data = await response.json();

      if (response.ok && !data.errors) {
        return res.status(200).json(data.data.applyJob);
      } else {
        console.error('GraphQL Errors:', data.errors || response.statusText);
        return res.status(500).json({ error: 'Failed to apply for job', details: data.errors || response.statusText });
      }
    } catch (error: any) {
      console.error('Server Error:', error.message);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
