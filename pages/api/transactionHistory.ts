                                                import { NextApiRequest,NextApiResponse } from "next";
                                                import { GraphQLClient,gql } from "graphql-request";
                                                const graphqlClientRequest=new GraphQLClient('http://localhost:3300/graphql');
                                                export default async function handler(req:NextApiRequest,res:NextApiResponse){
                                                    const {userId}=req.body;
                                                    const query=gql`
                                                    query ListTransactions($userId: String!){
                                                    
                                                    ListTransactions(userId: $userId){
                                                    amount
                                                    createdAt
                                                    transactionId
                                                    transactionType
                                                    userId
                                                    
                                                                                                    
                                                    }                                                           
                                                    
                                                    }                                                                                           
                                                    
                                                    `;
                                                    try{
                                                        const data=await  graphqlClientRequest.request(query,{userId});
                                                        res.status(200).json(data)
                                                    }catch(error){
                                                        console.log('error occured while processing transaction data');
                                                        res.status(404).json({error:'something went wrong'})
                                                    }

                                                }
