import styled from "styled-components";
import { device } from "../../../resources/styles/utils/media-query-utils";

interface NavSearchFieldComponentInterface {
  showOnMobile?: boolean;
}

export const NavSearchFieldComponent = styled.div<
  NavSearchFieldComponentInterface
>`
  width: 600px;
  margin-left: 5rem;
  padding: 0.3rem 0.5rem 0 0.3rem;
  background: #f1f3f4;
  border-radius: 0.5rem;

  transition: background 100ms ease-in, width 100ms ease-out, all 300ms;

  &:hover,
  &:focus-within {
    background: rgba(255, 255, 255, 1);
    border: 1px solid transparent;
    box-shadow: 0 1px 1px 0 rgba(65, 69, 73, 0.3),
      0 1px 3px 1px rgba(65, 69, 73, 0.15);
  }
 

  @media only screen and ${device.tablet} {
    width: 300px;
    margin-left: 1rem;
  }

  @media only screen and ${device.mobileL} {
    display: ${(props) => (props.showOnMobile ? "block" : "none")};
    position: fixed;
    margin: 0;
    width: 200px;
    left: 0.5rem;
    top: 0.5rem;
  }
`;

export const NavSearchFieldButton = styled.div`
  display: none;
 
  @media only screen and ${device.mobileL} {
    width: 100%;
    margin-right: 0.1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
    svg {
      color: #fff;
    }
  }
`;
