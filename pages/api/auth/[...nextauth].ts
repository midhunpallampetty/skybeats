import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { gql } from 'graphql-request';
import Cookies from 'js-cookie';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    // JWT callback with mutation handling
    async jwt({ token, account, user }) {
      if (account && user) {
        const mutation = gql`
          mutation($input: GoogleLoginInput!) {
            handleGoogleLogin(input: $input) {
              email
              token
              id
            }
          }
        `;

        try {
          const response = await fetch('http://localhost:3300/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: mutation,
              variables: {
                input: {
                  email: user.email,
                  password: account.access_token,
                  username: user.name
                }
              }
            }),
          });

          const result = await response.json();
          if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            return token;  // Return token as it is if there's an error
          }
          if (!response.ok) {
            console.error(`Failed to send mutation, status: ${response.status}`);
            return token;
          }

          // Store the result token and email into the token object
          token.accessToken = result.data.handleGoogleLogin.token;
          token.email = result.data.handleGoogleLogin.email;
          token.usersId=result.data.handleGoogleLogin.id;
          console.log('Mutation Result:', result.data);

        } catch (error) {
          console.error('Error during Google login mutation:', error);
          return token;
        }
      }

      return token;
    },

    // Session callback to return mutation result
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
          token: token.accessToken,
          usersId:token.usersId,
        };
      }
      return session;
    },

    // Redirect callback to handle where users are redirected after login
    async redirect({ url, baseUrl }) {
      if (url === '/api/auth/callback/google') {
        return `${baseUrl}/?googleauth=true/`; // Redirect after successful Google login
      }
      return `${baseUrl}/?googleauth=true`;
    },
  },
};

export default NextAuth(authOptions);
