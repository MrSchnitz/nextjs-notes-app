import { NoteType } from "../../models/Note";
import React, { ReactNode } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { children } from "cheerio/lib/api/traversing";
import { TagType } from "../../models/Tag";
import {NOTE_WIDTH} from "../NoteCard/note-card.styles";

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  //padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? "skyblue" : "white")};
  min-height: ${NOTE_WIDTH}px;
  //float: left;
  //flex: 50%;
  //flex-grow: 1;
  //min-height: 100px;
`;

interface ColumnProps {
  columnId: string;
  children: ReactNode[];
}

const Column: React.FC<ColumnProps> = ({ columnId, children }: ColumnProps) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <TaskList
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
        >
          {children}
          {provided.placeholder}
        </TaskList>
      )}
    </Droppable>
  );
};

export default Column;
