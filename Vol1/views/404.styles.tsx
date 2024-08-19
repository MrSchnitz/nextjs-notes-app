import styled from "styled-components";
import {device} from "../resources/styles/utils/media-query-utils";

export const NotFoundPageWrapper = styled.div`
  height: calc(100vh - 64px);
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  @media only screen and ${device.mobileL} {
    margin-left: -25px;
  }
`;

export const NotFoundPageContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const NotFoundPageHeading = styled.h1`
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  color: #fff;
  font-size: 15rem;
  -webkit-text-stroke: 4px #000;
  
  @media only screen and ${device.mobileL} {
    font-size: 10rem;
    -webkit-text-stroke: 3px #000;
  }
`;
