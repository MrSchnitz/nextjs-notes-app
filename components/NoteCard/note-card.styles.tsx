import styled from "styled-components";

interface NoteCardComponentInterface {
  color?: string;
  edit?: boolean;
}

export const NoteCardComponent = styled.div<NoteCardComponentInterface>`
  border-radius: 1rem;
  border: 1px solid #d6d6d6;
  padding: 0.5rem;
  margin: ${(props) => (props.edit ? "0rem" : "1rem")};
  width: 250px;
  height: max-content;
  cursor: pointer;
  background-color: ${(props) => (props.color ? props.color : "white")};

  transition: 0.3s all;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
  }
`;

NoteCardComponent.displayName = "NoteCardComponent";

export const NoteCardHeader = styled.div`
  padding: 0.2rem 0;
  font-weight: bold;
  border-bottom: 1px solid #000;
  margin-bottom: 0.5rem;

  display: flex;
  align-items: center;

  span {
    flex: 1;
  }

  svg {
    transition: 0.3s all;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const NoteCardContent = styled.div`
  text-align: justify;
  max-height: 400px;
  overflow-y: auto;
`;

export const NoteCardTags = styled.div`
  flex: 1;
  display: flex;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 5px;
  }
`;

export const NoteCardTag = styled.div`
  //margin: 0 0.5rem;
  border-radius: 0.5rem;
  padding: 0 0.2rem;
  white-space: nowrap;

  display: flex;
  align-items: center;
`;
