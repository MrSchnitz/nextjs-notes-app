"use client"
import styled from "styled-components";
import { device } from "../../resources/styles/utils/media-query-utils";

export const NotesPageAddNote = styled.div`
  padding: 3rem;
  width: 100%;
  display: flex;
  justify-content: center;

  @media only screen and ${device.mobileL} {
    padding: 1rem;
  }
`;

export const NotesPageNotes = styled.section`
  display: flex;
  flex-wrap: wrap;

  @media only screen and ${device.mobileL} {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }
`;

export const NotesPageNoNotes = styled.section`
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
  }
`;
