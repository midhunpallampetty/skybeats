import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import Cookie from 'js-cookie';
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID+'',
      clientSecret:process.env.GOOGLE_CLIENT_SECRET+'',
    }),
  
    
  ],

  // Callbacks for handling sessions and JWT
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url === "/api/auth/callback/google") {
        return `${baseUrl}/?googleauth=true`;
      }
      
      return `${baseUrl}/?googleauth=true`;
    },
    
  
    async signIn({ user, account, profile }) {
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      return true; 
    },
  },

};

export default NextAuth(authOptions);
