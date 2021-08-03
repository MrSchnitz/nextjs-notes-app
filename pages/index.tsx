import React from "react";
import Head from "next/head";
import { getSession, signIn } from "next-auth/client";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { PageLinks } from "../lib/Links";
import {
  LandingPageBanner,
  LandingPageBannerText,
  LandingPageBannerWrapper,
  LandingPageCardWrapper,
  LandingPageContentWrapper,
  LandingPageHeading,
  LandingPageSubHeading,
  LandingPageWrapper,
} from "./styles";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
} from "@material-ui/core";
import NoteIcon from "@material-ui/icons/Note";
import ListIcon from "@material-ui/icons/List";
import ArrowForwardOutlinedIcon from "@material-ui/icons/ArrowForwardOutlined";
import useSwitchTimeout from "../hooks/useSwitchTimeout";

const transition = {
  type: "spring",
  stiffness: 80,
};

const bannerVariants = {
  exit: { height: "0px", y: "-100%", transition },
  enter: {
    height: "300px",
    y: "0%",
    transition,
  },
};

export default function LandingPage() {
  const {
    switchContent: firstCardSwitch,
    setSwitchContent: setFirstCardSwitch,
  } = useSwitchTimeout(3);

  const {
    switchContent: secondCardSwitch,
    setSwitchContent: setSecondCardSwitch,
  } = useSwitchTimeout(4);

  const renderHeader = (
    <>
      <LandingPageHeading>Notes App</LandingPageHeading>
      <Button
        variant={"outlined"}
        size={"large"}
        startIcon={<ArrowForwardOutlinedIcon />}
        onClick={() => signIn()}
      >
        Sign In
      </Button>
      <LandingPageSubHeading>
        Capture what&apos;s on your mind
      </LandingPageSubHeading>
    </>
  );

  const renderLeftShowNoteWrapper = (
    <LandingPageCardWrapper>
      <LandingPageBannerWrapper>
        <LandingPageBanner
          imageUrl={
            "https://www.google.com/keep/img/capture/note-item-bg-2x.jpg"
          }
          position="absolute"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <LandingPageBannerText>Different kind of note</LandingPageBannerText>
        </LandingPageBanner>
        <LandingPageBanner
          position="absolute"
          color="#ffe900"
          initial={"exit"}
          animate={firstCardSwitch ? "enter" : "exit"}
          exit={"exit"}
          variants={bannerVariants}
          style={{ originX: 0.5 }}
        >
          Cool awesome exciting note
        </LandingPageBanner>
      </LandingPageBannerWrapper>
      <IconButton onClick={() => setFirstCardSwitch(!firstCardSwitch)}>
        <NoteIcon />
      </IconButton>
    </LandingPageCardWrapper>
  );

  const renderRightShowNoteWrapper = (
    <LandingPageCardWrapper className="ms-5">
      <LandingPageBannerWrapper>
        <LandingPageBanner
          imageUrl={
            "https://www.google.com/keep/img/capture/list-item-bg-2x.jpg"
          }
          position="absolute"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <LandingPageBannerText>Some useful note</LandingPageBannerText>
        </LandingPageBanner>
        <LandingPageBanner
          position="absolute"
          color="#1ce8b5"
          initial={"exit"}
          animate={secondCardSwitch ? "enter" : "exit"}
          exit={"exit"}
          variants={bannerVariants}
          style={{ originX: 0.5 }}
        >
          <h5 className="fw-bold">Shopping list</h5>
          <FormControlLabel control={<Checkbox />} label="Bread" />
          <FormControlLabel control={<Checkbox />} label="Eggs" />
          <FormControlLabel control={<Checkbox />} label="Ham" />
          <Divider className="bg-dark" />
          <FormControlLabel
            control={<Checkbox color={"default"} checked={true} />}
            label="Salad"
            style={{ textDecoration: "line-through" }}
          />
          <FormControlLabel
            control={<Checkbox color={"default"} checked={true} />}
            label="Milk"
            style={{ textDecoration: "line-through" }}
          />
        </LandingPageBanner>
      </LandingPageBannerWrapper>
      <IconButton
        onClick={() => setSecondCardSwitch(!secondCardSwitch)}
        size={"medium"}
      >
        <ListIcon />
      </IconButton>
    </LandingPageCardWrapper>
  );

  const renderMainContent = (
    <LandingPageWrapper>
      {renderHeader}
      <LandingPageContentWrapper>
        {renderLeftShowNoteWrapper}
        {renderRightShowNoteWrapper}
      </LandingPageContentWrapper>
    </LandingPageWrapper>
  );

  return (
    <>
      <Head>
        <title>Notes</title>
        <meta
          name="description"
          content="Notes application for thoughts saving purpose"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {renderMainContent}
    </>
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
