import React from "react";
import {
  NotFoundPageContentWrapper,
  NotFoundPageHeading,
  NotFoundPageWrapper,
} from "../views/404.styles";
import Image from "next/image";
import notFoundGif from "../resources/assets/404.gif";
import { useRouter } from "next/router";
import { Button } from "@material-ui/core";
import { PageLinks } from "../lib/Links";
import DirectionsRunOutlinedIcon from "@material-ui/icons/DirectionsRunOutlined";
import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";

export default function NotFoundPage() {
  const { push } = useRouter();

  return (
    <NotFoundPageWrapper>
      <NotFoundPageContentWrapper>
        <NotFoundPageHeading>404</NotFoundPageHeading>
        <Image src={notFoundGif} alt="Confused John Travolta GIF" />
        <Button
          fullWidth={true}
          variant={"outlined"}
          size={"large"}
          startIcon={<DirectionsRunOutlinedIcon />}
          endIcon={<FastRewindOutlinedIcon />}
          onClick={() => push(PageLinks.landingPage)}
        >
          Return to safety
        </Button>
      </NotFoundPageContentWrapper>
    </NotFoundPageWrapper>
  );
}
