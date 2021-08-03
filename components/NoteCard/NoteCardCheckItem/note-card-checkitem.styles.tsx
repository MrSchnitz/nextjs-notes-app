import styled from "styled-components";

export const NoteCardCheckItemComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const NoteCardCheckItemCheck = styled.div`
  //margin-right: 1rem;
`;

interface NoteCardCheckItemTextInterface {
  checked: boolean;
}

export const NoteCardCheckItemText = styled.span<
  NoteCardCheckItemTextInterface
>`
  flex: 1;
  display: flex;
  align-items: center;
  text-decoration: ${(props) => (props.checked ? "line-through" : "none")};
`;
