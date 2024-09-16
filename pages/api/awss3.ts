import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { filename, filetype } = req.body;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
      ContentType: filetype,
      ACL: 'public-read',
    });

    try {
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 1000 });
      res.status(200).json({ uploadUrl });
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).json({ error: 'Error generating pre-signed URL' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
