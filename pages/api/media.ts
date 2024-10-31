import type {NextApiRequest,NextApiResponse} from 'next';
import  S3  from 'aws-sdk/clients/s3';
import { randomUUID } from 'crypto';

const s3=new S3({
    apiVersion:'2012-10-17',
    accessKeyId:process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region:'ap-south-1',
    signatureVersion:'v4'
});


export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    const ex=(req.query.fileType as string).split('/')[1];
    const Key=`${randomUUID()}.${ex}`;
    const s3Params={
        Bucket:'airline-datacenter',
        Key,
        Expires:60,
        ContentType:`image/${ex}`,
    };
    const uploadUrl=await s3.getSignedUrl
    ('putObject',s3Params);
    res.status(200).json({uploadUrl,key:Key});
}
