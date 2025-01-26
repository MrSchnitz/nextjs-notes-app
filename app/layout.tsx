import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../resources/styles/main.scss";
import Providers from "@/app/Providers";
import Navbar from "@/components/Navigation/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes App",
  description: "App to capture what's on your mind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" data-theme="light">
        <head>
          <link
            href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
            rel="stylesheet"
          />
          <title>Notes app</title>
        </head>
        <body className={inter.className}>
          <Navbar>{children}</Navbar>
        </body>
      </html>
    </Providers>
  );
}
