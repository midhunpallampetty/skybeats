import {NextApiRequest,NextApiResponse} from 'next';
import {gql,GraphQLClient} from 'graphql-request';
const GetCloudImages=async(req:NextApiRequest,res:NextApiResponse)=>{
    const graphQLClient = new GraphQLClient('http://localhost:3300/graphql');
    const query=gql`
    query GetCloudImages{
    GetCloudImages{
    imageUrl
    }
    }
    `;
    try{
        const data:any=await graphQLClient.request(query)
        const imageUrl: String[] = data.GetCloudImages;

        console.log('data received from gql',imageUrl);
          return res.status(200).json(imageUrl)
    }catch(error){
        console.log('gql server error')
        res.status(500).json({msg:"Error receiving data"})
    }
}

export default GetCloudImages;