
import { gql } from "@apollo/client";

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    verifyOtp(email: $email, otp: $otp) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;
