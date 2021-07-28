import "bootstrap/dist/css/bootstrap.css";
import "../resources/styles/base/globals.scss";
import "@fontsource/roboto";

import type { AppProps } from "next/app";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { initializeStore } from "../store/configureStore";
import { getSession, Provider, useSession } from "next-auth/client";
import App from "next/app";
import Navbar from "../components/Navigation/Navbar/navbar.component";

export const store = initializeStore();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ReduxProvider store={store}>
        <Navbar>
          <Component {...pageProps} />
        </Navbar>
      </ReduxProvider>
    </Provider>
  );
}
export default MyApp;
