// pages/api/applyJob.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, phone, coverLetter, cv } = req.body;
    console.log(req.body)

    try {
      // Make a request to your existing backend GraphQL API
      const response = await fetch('http://localhost:3300/graphql', {
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
            },
          },
        }),
      });

      // Parse the response from the backend
      const data = await response.json();

      if (response.ok) {
        return res.status(200).json(data.data.applyJob);
      } else {
        return res.status(500).json({ error: 'Failed to apply for job' });
      }
    } catch (error:any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
