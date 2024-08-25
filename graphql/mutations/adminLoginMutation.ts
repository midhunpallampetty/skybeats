import  {gql} from '@apollo/client'
export const ADMIN_LOGIN_MUTATION=gql`
mutation adminLogin($email:String!,$password:String!,$adminType:String!){
adminLogin(email:$email,password:$password,adminType:$adminType){
token
admin{
email
adminType
}
}
}
`