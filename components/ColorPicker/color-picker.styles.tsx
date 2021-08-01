import styled from "styled-components";
import {device} from "../../resources/styles/utils/media-query-utils";

export const ColorPickerMain = styled.div`
  position: relative;
`;

interface ColorPickerContentInterface {
  edit?: boolean;
}

export const ColorPickerContent = styled.div<ColorPickerContentInterface>`
  position: absolute;
  bottom: 3rem;
  ${(props) => (props.edit ? "right: 0" : "left: 0")};
  z-index: 3;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
  border: 1px solid lightgray;
  
  @media only screen and ${device.mobileL} {
    right: 0;
    left: auto;
  }
`;
