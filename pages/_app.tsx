import "@/styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}

export default MyApp;
 