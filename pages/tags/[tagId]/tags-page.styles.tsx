import styled from "styled-components";
import { device } from "../../../resources/styles/utils/media-query-utils";

export const TagsPageNotes = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media only screen and ${device.mobileL} {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }
`;

export const TagsPageNoNotes = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  text-align: center;
  align-items: center;

  h1 {
    color: #4c5258;
    font-weight: bold;
    font-size: 2.5rem;

    @media only screen and ${device.mobileL} {
      font-size: 1.5rem;
    }
  }
`;
