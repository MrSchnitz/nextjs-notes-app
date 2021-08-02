import React from "react";
import { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { initializeStore } from "../store/configureStore";
import { Provider } from "next-auth/client";
import Navbar from "../components/Navigation/Navbar/navbar.component";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.css";
import "../resources/styles/main.scss";
import "@fontsource/roboto";
import "react-toastify/dist/ReactToastify.css";

export const store = initializeStore();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ReduxProvider store={store}>
        <Navbar>
          <Component {...pageProps} />
        </Navbar>
        <ToastContainer position={"bottom-right"} />
      </ReduxProvider>
    </Provider>
  );
}
export default MyApp;
