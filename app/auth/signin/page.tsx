"use client";

import { Button, Divider, InputAdornment, TextField } from "@material-ui/core";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  SignInPageContainer,
  SignInPageForm,
  SignInPageHeadline,
  SignInPageLogo,
} from "../../../views/auth/signin/sigin.styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import keepLogo from "../../../resources/assets/keep.svg";
import Image from "next/image";

const OtherProviderButton = ({
  provider,
}: {
  provider: ClientSafeProvider;
}) => {
  return (
    <Button
      key={provider.name}
      size={"small"}
      className="mt-2"
      variant={"outlined"}
      fullWidth={true}
      endIcon={<GitHubIcon />}
      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
    >
      Sign in with
    </Button>
  );
};

const CredentialsProviderSection = ({
  provider,
}: {
  provider: ClientSafeProvider;
}) => {
  const [userName, setUserName] = useState("");

  const handleSignIn = () => {
    signIn("credentials", { userName: userName, callbackUrl: "/" });
  };

  return (
    <>
      <TextField
        margin={"normal"}
        label={"Username"}
        placeholder={"Insert username"}
        variant={"standard"}
        fullWidth={true}
        size={"small"}
        InputProps={{
          startAdornment: (
            <InputAdornment position={"start"}>
              <PersonOutlineOutlinedIcon fontSize={"small"} />
            </InputAdornment>
          ),
        }}
        onChange={(event) => setUserName(event.target.value)}
        onKeyDown={(event) => event.keyCode === 13 && handleSignIn()}
        value={userName}
      />
      <Button
        size={"small"}
        className="mt-2"
        variant={"outlined"}
        fullWidth={true}
        onClick={handleSignIn}
      >
        Sign in
      </Button>
      <Divider className="w-100 mt-3 bg-dark" variant={"fullWidth"} />
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

  return (
    <>
      <Head>
        <title>SignIn page</title>
        <meta name="description" content="SignIn page" />
      </Head>
      <SignInPageContainer>{renderForm()}</SignInPageContainer>
    </>
  );
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
