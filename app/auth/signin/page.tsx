"use client";

import React, { startTransition, useEffect, useState } from "react";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import keepLogo from "../../../resources/assets/keep.svg";
import Image from "next/image";
import { PAGE_LINKS } from "@/lib/Links";

const OtherProviderButton = ({
  provider,
}: {
  provider: ClientSafeProvider;
}) => {
  return (
    <button
      key={provider.name}
      className="btn btn-sm w-full"
      onClick={() => signIn(provider.id, { callbackUrl: PAGE_LINKS.notesPage })}
    >
      Sign in with {provider.name}
    </button>
  );
};

const CredentialsProviderSection = ({
  provider,
}: {
  provider: ClientSafeProvider;
}) => {
  const [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });

  const handleSignIn = () => {
    signIn("credentials", {
      userName: credentials.userName,
      password: credentials.password,
      callbackUrl: PAGE_LINKS.notesPage,
    }).catch((error) => console.log(error));
  };

  return (
    <>
      <input
        type="text"
        className="input input-sm w-full mb-1"
        placeholder="Username"
        onChange={(event) =>
          setCredentials((prevState) => ({
            ...prevState,
            userName: event.target.value,
          }))
        }
        onKeyDown={(event) => event.code === "Enter" && handleSignIn()}
        value={credentials.userName}
      />
      <input
        type="text"
        className="input input-sm w-full"
        placeholder="Password"
        onChange={(event) =>
          setCredentials((prevState) => ({
            ...prevState,
            password: event.target.value,
          }))
        }
        onKeyDown={(event) => event.code === "Enter" && handleSignIn()}
        value={credentials.password}
      />
      <button className="btn btn-sm w-full mt-1 mb-3" onClick={handleSignIn}>
        Sign in
      </button>
      <hr />
    </>
  );
};

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    getProviders().then((providers) => {
      setProviders(providers);
    });
  }, []);

  const renderHeader = (
    <>
      <div className="my-1 border-2 border-white rounded-lg [&_svg]:h-[50px] [&_svg]:w-[50px]">
        <Image src={keepLogo} alt="logo" height={50} width={50} />
      </div>
      <h1 className="font-bold text-2xl uppercase text-white mb-2">Notes</h1>
    </>
  );

  const renderProvidersInputs =
    providers &&
    Object.values(providers)
      .sort((a) => (a.id === "credentials" ? -1 : 1))
      .map((provider: ClientSafeProvider) => {
        switch (provider.id) {
          case "credentials":
            return (
              <CredentialsProviderSection
                key={provider.id}
                provider={provider}
              />
            );
          default:
            return (
              <OtherProviderButton key={provider.id} provider={provider} />
            );
        }
      });

  const renderForm = () => {
    return (
      <div className="flex flex-col items-center w-[300px] bg-app-primary p-4 rounded-xl shadow-[0_0_1rem_rgba(0,0,0,0.3)]">
        {renderHeader}
        {renderProvidersInputs}
      </div>
    );
  };

  return (
    <section className="w-full h-screen flex justify-center items-center">
      {renderForm()}
    </section>
  );
}
