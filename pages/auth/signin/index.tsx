import {
  ClientSafeProvider,
  getProviders,
  getSession,
  signIn,
} from "next-auth/client";
import KeepLogo from "../../../resources/assets/keep.svg";
import { Button, IconButton } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import {
  SignInPageContainer,
  SignInPageForm,
  SignInPageHeadline,
  SignInPageLogo,
} from "./sigin.styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

interface SignInProps {
  providers: Record<string, ClientSafeProvider> | null;
}

export default function Index({ providers }: SignInProps) {
  const renderForm = () => {
    return (
      <SignInPageForm
      // onKeyDown={event => event.keyCode === 13 && handleAuthenticate()}
      >
        <SignInPageLogo>
          <KeepLogo />
        </SignInPageLogo>
        <SignInPageHeadline>Notes</SignInPageHeadline>
        {/*<TextField*/}
        {/*    margin={"normal"}*/}
        {/*    label={"Username"}*/}
        {/*    placeholder={"Insert username"}*/}
        {/*    variant={"standard"}*/}
        {/*    fullWidth={true}*/}
        {/*    size={"small"}*/}
        {/*    InputProps={{*/}
        {/*      startAdornment: (*/}
        {/*          <InputAdornment position={"start"}>*/}
        {/*            <PersonOutlineOutlinedIcon fontSize={"small"} />*/}
        {/*          </InputAdornment>*/}
        {/*      ),*/}
        {/*    }}*/}
        {/*    onChange={event => dispatch(SignInAPI.handleChangeUserName(event.target.value))}*/}
        {/*    value={usernameInput}*/}
        {/*/>*/}

        {/*<TextField*/}
        {/*    margin={"normal"}*/}
        {/*    label={"Password"}*/}
        {/*    title={"Password"}*/}
        {/*    placeholder="Insert password"*/}
        {/*    variant={"standard"}*/}
        {/*    fullWidth={true}*/}
        {/*    size={"small"}*/}
        {/*    InputProps={{*/}
        {/*      startAdornment: (*/}
        {/*          <InputAdornment position={"start"}>*/}
        {/*            <LockOutlinedIcon fontSize={"small"} />*/}
        {/*          </InputAdornment>*/}
        {/*      ),*/}
        {/*    }}*/}
        {/*    onChange={event => dispatch(SignInAPI.handleChangePassword(event.target.value))}*/}
        {/*    value={passwordInput}*/}
        {/*/>*/}
        {providers &&
          Object.values(providers).map((provider: ClientSafeProvider) => (
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
          ))}
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

  // return (
  //   <>
  //
  //     {Object.values(providers).map((provider: any) => (
  //       <div key={provider.name}>
  //         <button onClick={() => signIn(provider.id)}>
  //           Sign in with {provider.name}
  //         </button>
  //       </div>
  //     ))}
  //   </>
  // );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SignInProps>> {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session && res && session.accessToken) {
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
