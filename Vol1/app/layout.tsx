import React, { ReactNode } from "react";
import StyledComponentsRegistry from "../lib/registry";
import { ToastContainer } from "react-toastify";
import Providers from "./Providers";
import Navbar from "../components/Navigation/Navbar/navbar.component";

// import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import "../resources/styles/main.scss";
import "@fontsource/roboto";
// import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <html lang="en" className="dark">
        <body>
          <Navbar>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </Navbar>
          <ToastContainer position={"bottom-right"} />
        </body>
      </html>
    </Providers>
  );
}
