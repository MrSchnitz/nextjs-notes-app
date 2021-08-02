import Head from "next/head";
import { getSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { PageLinks } from "../internals/Links";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Landing page</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: PageLinks.notesPage,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
