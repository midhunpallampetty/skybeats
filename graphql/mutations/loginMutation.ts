import { gql } from "@apollo/client";

export const SIGNIN_MUTATION = gql`
  mutation userLogin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      token
      user {
        email
        isBlocked
        id
      }
    }
  }
`;
