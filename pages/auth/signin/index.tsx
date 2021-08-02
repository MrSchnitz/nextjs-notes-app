import {ClientSafeProvider, getProviders, getSession, signIn,} from "next-auth/client";
import KeepLogo from "../../../resources/assets/keep.svg";
import {Button, Divider, InputAdornment, TextField} from "@material-ui/core";
import Head from "next/head";
import React, {useState} from "react";
import {SignInPageContainer, SignInPageForm, SignInPageHeadline, SignInPageLogo,} from "./sigin.styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import {GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";

export interface SignInProps {
  providers: Record<string, ClientSafeProvider> | null;
}

export default function SignInPage({ providers }: SignInProps) {
  const [userName, setUserName] = useState("");

  const renderForm = () => {
    return (
      <SignInPageForm>
        <SignInPageLogo>
          <KeepLogo />
        </SignInPageLogo>
        <SignInPageHeadline>Notes</SignInPageHeadline>
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
          onKeyDown={(event) => event.keyCode === 13 && signIn("credentials", { userName: userName })}
          value={userName}
        />
        <Button
          size={"small"}
          className="mt-2"
          variant={"outlined"}
          fullWidth={true}
          onClick={() =>
            signIn("credentials", { userName: userName })
          }
        >
          Sign in
        </Button>
        <Divider className="w-100 mt-3 bg-dark" variant={"fullWidth"}/>
        {providers &&
          Object.values(providers).map(
            (provider: ClientSafeProvider) =>
              provider.name !== "credentials" && (
                <Button
                  key={provider.name}
                  size={"small"}
                  className="mt-2"
                  variant={"outlined"}
                  fullWidth={true}
                  endIcon={<GitHubIcon />}
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with
                </Button>
              )
          )}
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

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SignInProps>> {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session && res) {
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return {
      props: { providers: null },
    };
  }

  const providers: Record<
    string,
    ClientSafeProvider
  > | null = await getProviders();

  return {
    props: {
      providers: providers,
    },
  };
}
