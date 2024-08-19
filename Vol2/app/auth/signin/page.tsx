"use client";

import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  SignInPageContainer,
  SignInPageForm,
  SignInPageHeadline,
  SignInPageLogo,
} from "@/views/auth/signin/sigin.styles";
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
  const [userName, setUserName] = useState("");

  const handleSignIn = () => {
    signIn("credentials", {
      userName: userName,
      callbackUrl: PAGE_LINKS.notesPage,
    });
  };

  return (
    <>
      <input
        type="text"
        className="input input-sm w-full"
        onChange={(event) => setUserName(event.target.value)}
        onKeyDown={(event) => event.keyCode === 13 && handleSignIn()}
        value={userName}
      />
      <button className="btn btn-sm w-full mt-2 mb-3" onClick={handleSignIn}>
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
      <SignInPageLogo>
        <Image src={keepLogo} alt="logo" height={40} width={40} />
      </SignInPageLogo>
      <SignInPageHeadline>Notes</SignInPageHeadline>
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
      <SignInPageForm>
        {renderHeader}
        {renderProvidersInputs}
      </SignInPageForm>
    );
  };

  return <SignInPageContainer>{renderForm()}</SignInPageContainer>;
}

// export async function getServerSideProps(
//   context: GetServerSidePropsContext
// ): Promise<GetServerSidePropsResult<SignInProps>> {
//   const { req, res } = context;
//   const session = await getSession({ req });
//
//   if (session && res) {
//     res.writeHead(302, {
//       Location: "/",
//     });
//     res.end();
//     return {
//       props: { providers: null },
//     };
//   }
//
//   const providers: Record<
//     string,
//     ClientSafeProvider
//   > | null = await getProviders();
//
//   return {
//     props: {
//       providers: providers,
//     },
//   };
// }
