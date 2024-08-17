import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation UserSignup($username: String!, $email: String!, $password: String!) {
    userSignup(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;
