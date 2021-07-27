import 'bootstrap/dist/css/bootstrap.css'
import "../resources/styles/base/globals.scss";
import "@fontsource/roboto";

import type { AppProps } from "next/app";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { initializeStore } from "../store/configureStore";
import { Provider } from "next-auth/client";

export const store = initializeStore();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>
    </Provider>
  );
}
export default MyApp;
