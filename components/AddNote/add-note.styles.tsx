import styled from "styled-components";
import { device } from "../../resources/styles/utils/media-query-utils";
import { motion } from "framer-motion";
import { NoteTypeEnum } from "../../models/Note";

interface AddNoteInputInterface {
  open: boolean;
  edit?: boolean;
  checkpoints?: number;
  type?: NoteTypeEnum;
}

export const AddNoteInput = styled.div<AddNoteInputInterface>`
  height: ${(props) =>
    props.edit
      ? "max-content"
      : props.open
      ? props.type === NoteTypeEnum.CHECK &&
        props.checkpoints &&
        props.checkpoints <= 3
        ? `${props.checkpoints * 38 + 162}px`
        : props.type === NoteTypeEnum.CHECK
        ? "276px"
        : "235px"
      : "45px"};
  width: ${(props) => (props.edit ? "100%" : "500px")};
  padding: 0.6rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;

  transition: 0.5s all;

  @media only screen and ${device.mobileL} {
    width: 100%;
  }
`;

export const AddNoteInputNameInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  border-radius: 0.5rem;
  font-weight: bold;

  &:focus {
    border-bottom: 1px solid gray;
  }
`;

export const AddNoteInputErrorMessage = styled.span`
  position: absolute;
  color: red;
  bottom: 5rem;
`;

export const AddNoteInputContentWrapper = styled(motion.div)`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AddNoteInputContent = styled.textarea`
  margin-top: 1rem;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 0.5rem;
  resize: none;
  background-color: transparent;

  &:focus {
    border-bottom: 1px solid gray;
  }
`;

export const AddNoteInputTags = styled.div`
  flex: 1;
  display: flex;
  overflow-x: auto;
  padding: 0.3rem 0;

  &::-webkit-scrollbar {
    height: 5px;
  }
`;

export const AddNoteInputMenu = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const AddNoteInputContentSwitch = styled.div`
  padding: 0 0.3rem;
  border-left: 1px solid lightgray;

  svg {
    cursor: pointer;
    transition: 0.3s transform;
  }
  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
`;

interface AddNoteInputCheckPointsInterface {
    edit: boolean;
}

export const AddNoteInputCheckPoints = styled.div<AddNoteInputCheckPointsInterface>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  max-height: ${(props) => props.edit ? "300px" : "114px"};
  overflow-y: auto;
`;

export const AddNoteInputAddCheckPoint = styled.div`
  margin: 0.2rem 0;
  cursor: pointer;

  &:hover {
    svg {
      color: #f5b500;
    }
  }

  svg {
    transition: 0.3s all;
  }
`;

interface AddNoteInputTagInterface {
  chosen?: boolean;
}

export const AddNoteInputTag = styled.div<AddNoteInputTagInterface>`
  margin: 0 0.1rem;
  cursor: pointer;
  border-radius: 1rem;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;

  display: flex;
  align-items: center;

  transition: all 0.3s;

  ${(props) => props.chosen && "background-color: #a5a5a5; color: white;"}

  &:hover {
    background-color: #a5a5a5;
    color: white;
  }
`;
