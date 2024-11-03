import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { gql } from 'graphql-request';
import { JWT } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next'
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account?: any; user?: any }) {
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
                  username: user.name,
                },
              },
            }),
          });

          if (!response.ok) {
            console.error(`GraphQL request failed, status: ${response.status}`);
            return token;
          }

          const result = await response.json();

          if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            return token;
          }

          const { email, token: accessToken, id: usersId } = result.data?.handleGoogleLogin || {};

          if (accessToken && email && usersId) {
            token.accessToken = accessToken;
            token.email = email;
            token.usersId = usersId;
          }

        } catch (error) {
          console.error('Error during Google login mutation:', error);
          return token;
        }
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user = {
          email: token.email,
          token: token.accessToken,
          usersId: token.usersId,
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url === '/api/auth/callback/google') {
        return `${baseUrl}/?googleauth=true`;
      }
      return `${baseUrl}/?googleauth=true`;
    },
  },
};

export default (req:NextApiRequest, res:NextApiResponse) => NextAuth(req, res, authOptions);