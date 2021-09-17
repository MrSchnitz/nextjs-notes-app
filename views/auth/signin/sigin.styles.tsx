import styled from "styled-components";
import { device } from "../../../resources/styles/utils/media-query-utils";

const SignInPageContainer = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and ${device.mobileL} {
    margin: 0 -25px;
  }
`;

const SignInPageForm = styled.div`
  width: 300px;
  background-color: #f5b500;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignInPageLogo = styled.div`
  margin: 0.5rem 0;
  border: 3px solid white;
  border-radius: 0.5rem;
  svg {
    width: 50px;
    height: 50px;
  }
`;

const SignInPageHeadline = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #fff;
`;

export {
  SignInPageContainer,
  SignInPageForm,
  SignInPageHeadline,
  SignInPageLogo,
};
