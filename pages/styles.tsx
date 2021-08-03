import styled from "styled-components";
import { motion } from "framer-motion";
import { device } from "../resources/styles/utils/media-query-utils";

const dFlexCentered = `display: flex;
  justify-content: center;
  align-items: center;`;

export const LandingPageWrapper = styled(motion.div)`
  height: 100%;
  flex-direction: column;
  ${dFlexCentered}

  @media only screen and ${device.mobileL} {
    height: max-content;
    margin-left: -50px;
    margin-top: 2rem;
  }
`;

export const LandingPageContentWrapper = styled(motion.div)`
  ${dFlexCentered}
  
  @media only screen and ${device.mobileL} {
    flex-direction: column;
  }
`;

export const LandingPageCardWrapper = styled(motion.div)`
  flex-direction: column;
  ${dFlexCentered}

  @media only screen and ${device.mobileL} {
    margin: 0 !important;
  }
`;

export const LandingPageHeading = styled.h1`
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 4rem;
  color: #f5b500;
`;

export const LandingPageSubHeading = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #8a8a8a;
`;

interface LandingPageBannerInterface {
  imageUrl?: string;
  color?: string;
  position?: string;
}

export const LandingPageBannerWrapper = styled.div`
  position: relative;
  height: 300px;
  width: 300px;
  overflow: hidden;
`;

export const LandingPageBanner = styled(motion.div)<LandingPageBannerInterface>`
  height: 300px;
  width: 300px;
  transform-origin: top;
  font-size: 2.8rem;
  font-family: "Roboto Slab", serif;
  font-weight: lighter;
  padding: 1rem;
  top: 0;
  background-size: cover;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  position: ${(props) => (props.position ? props.position : "relative")};
  background: ${(props) =>
    props.imageUrl
      ? `url(${props.imageUrl})`
      : props.color
      ? props.color
      : "#ffe900"};
`;

export const LandingPageBannerText = styled(motion.h1)`
  font-family: "Shadows Into Light Two", cursive;
  font-size: 1.8rem;
  left: 0;
  padding: 10px;
  position: absolute;
  right: 0;
  text-align: center;
  top: 50%;
  -webkit-transform: translateY(-50%) rotate(-4deg);
  transform: translateY(-50%) rotate(-4deg);
`;
