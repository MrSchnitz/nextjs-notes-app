import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import AddNote from "../../components/AddNote/add-note.component";
import {
  NotesPageAddNote,
  NotesPageNoNotes,
  NotesPageNotes,
} from "../../views/notes/notes-page.styles";
import { useDispatch, useSelector } from "react-redux";
import {
  NotesAPI,
  selectCurrentRoute,
  selectEditNote,
  selectNote,
  selectSearchNotes,
  selectSearchNotesLoading,
} from "../../API/NotesPageAPI/NotesAPI";
import { get } from "../../lib/RestAPI";
import { NoteType } from "../../models/Note";
import React, { useCallback, useEffect, useRef, useState } from "react";
import NoteCard from "../../components/NoteCard/note-card.component";
import { TagType } from "../../models/Tag";
import { selectTags } from "../../API/TagsAPI/TagsAPI";
import {ChangeActionType, changeNotesRowOrder} from "../../lib/helpers";
import { useRouter } from "next/router";
import { ApiLinks, PageLinks } from "../../lib/Links";
import { CheckPointType } from "../../models/CheckPointObject";
import { Loading } from "../../components/Loading/loading.component";
import Head from "next/head";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DropResult,
} from "react-beautiful-dnd";
import Column from "../../components/Column/column.component";
import {
  NOTE_WIDTH,
  NoteCardContainer,
} from "../../components/NoteCard/note-card.styles";

interface NoteColumnType {
  columnId: string;
  notes: NoteType[];
}

const orderNotes = (notes: NoteType[]): NoteColumnType[] => {
  const col = 12;

  const columns: NoteColumnType[] = [];

  for (let i = 0; i < col; i++) {
    columns.push({
      columnId: `${i}`,
      notes: notes
        .filter((note) => note.column === i)
        .sort((a, b) => a.row - b.row),
    });
  }

  return columns;
};

export interface NotesPageProps {
  session: Session | null;
  userNotes: NoteType[];
}

export default function NotesPage({ session, userNotes }: NotesPageProps) {
  const dispatch = useDispatch();

  const router = useRouter();

  const [notesToRender, setNotesToRender] = useState(orderNotes(userNotes));

  const newNote = useSelector(selectNote);
  const editNote = useSelector(selectEditNote);
  const searchNotes = useSelector(selectSearchNotes);
  const searchNotesLoading = useSelector(selectSearchNotesLoading);
  const currentRoute = useSelector(selectCurrentRoute);
  const tags: TagType[] = useSelector(selectTags);

  useEffect(() => {
    router.replace(currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    if (searchNotes.length > 0) {
      setNotesToRender(orderNotes(searchNotes));
    } else {
      setNotesToRender(orderNotes(userNotes));
    }
  }, [userNotes, searchNotes]);

  const handleOnAddNote = (update: boolean) => {
    dispatch(NotesAPI.addNote(update));
  };

  const handleChangeNote = (action: ChangeActionType) => {
    dispatch(NotesAPI.handleChange(action));
  };

  const handleOnDeleteNote = (note: NoteType) => {
    dispatch(NotesAPI.deleteNote(note));
  };

  const handleClickNoteCheckItem = (
    note: NoteType,
    checkitem: CheckPointType
  ) => {
    dispatch(NotesAPI.checkNoteAndSubmit({ note: note, checkitem: checkitem }));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (
      source.droppableId !== destination!.droppableId ||
      source.index !== destination!.index
    ) {
      const sourceColumn = notesToRender.find(
        (col) => col.columnId === source.droppableId
      );
      const desColumn = notesToRender.find(
        (col) => col.columnId === destination.droppableId
      );

      if (sourceColumn && desColumn) {
        const noteSourceToChange: NoteType | undefined =
          sourceColumn.notes.find(
            (note) =>
              note.column === parseInt(source.droppableId) &&
              note.row === source.index
          );

        if (!noteSourceToChange) {
          return;
        }
        noteSourceToChange.column = parseInt(destination.droppableId);
        noteSourceToChange.row = destination.index;

        const newRow = destination.index;


        if(source.droppableId === destination.droppableId) {
          let newColumnNotes = desColumn.notes.filter(n => n.id !== noteSourceToChange.id);

          newColumnNotes.splice(newRow, 0, noteSourceToChange);

          newColumnNotes = changeNotesRowOrder(newColumnNotes);

          dispatch(NotesAPI.changeNotesOrder(newColumnNotes));

          const newNotesToRender = [...notesToRender];

          for(let cn of newNotesToRender) {
            if(cn.columnId === destination.droppableId) {
              cn.notes = newColumnNotes;
            }
          }

          setNotesToRender(newNotesToRender);
        } else {
          // DESTINATION COLUMN
          let desColumnNotes = [...desColumn.notes]
          desColumnNotes.splice(newRow, 0, noteSourceToChange);
          desColumnNotes = changeNotesRowOrder(desColumnNotes);

          // SOURCE COLUMN
          let sourceColumnNotes = sourceColumn.notes.filter(
              (note) => note.id !== noteSourceToChange.id
          );
          if (sourceColumnNotes.length > 0) {
            sourceColumnNotes = changeNotesRowOrder(sourceColumnNotes);
          }

          const changedNotes = sourceColumnNotes.concat(desColumnNotes);

          dispatch(NotesAPI.changeNotesOrder(changedNotes));

          const newNotesToRender = [...notesToRender];

          for (let col of newNotesToRender) {
            if (col.columnId === source.droppableId) {
              col.notes = [...sourceColumnNotes];
            } else if (col.columnId === destination.droppableId) {
              col.notes = [...desColumnNotes];
            }
          }

          setNotesToRender(newNotesToRender);
        }
      }
    }
  };

  const renderAddNoteInput = (
    <NotesPageAddNote>
      <AddNote
        tags={tags}
        onHandleChange={(action) =>
          handleChangeNote({ ...action, edit: false })
        }
        noteModel={newNote}
        onAddNote={() => handleOnAddNote(false)}
      />
    </NotesPageAddNote>
  );

  const renderNoteCards = searchNotesLoading ? (
    <Loading size={30} />
  ) : notesToRender && notesToRender.length > 0 ? (
    <DragDropContext onDragEnd={onDragEnd}>
      <NotesPageNotes>
        {notesToRender.map((noteColumn, index) => (
          <Column key={index} columnId={noteColumn.columnId}>
            {noteColumn.notes.map((note, index) => (
              <Draggable key={note.id} draggableId={note.id!} index={index}>
                {(provided, snapshot) => (
                  <NoteCardContainer
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                  >
                    <NoteCard
                      index={index}
                      note={note}
                      tags={tags}
                      editNote={editNote}
                      onHandleChange={(action) =>
                        handleChangeNote({ ...action, edit: true })
                      }
                      onAddNote={() => handleOnAddNote(true)}
                      onClick={() =>
                        dispatch(NotesAPI.setNote({ note: note, edit: true }))
                      }
                      onDeleteNote={() => handleOnDeleteNote(note)}
                      onCheckItemClick={(checkitem) =>
                        handleClickNoteCheckItem(note, checkitem)
                      }
                    />
                  </NoteCardContainer>
                )}
              </Draggable>
            ))}
          </Column>
        ))}
      </NotesPageNotes>
    </DragDropContext>
  ) : (
    <NotesPageNoNotes>
      <h1>Sorry, no notes are available...</h1>
    </NotesPageNoNotes>
  );

  return (
    <>
      <Head>
        <title>My notes</title>
      </Head>
      {renderAddNoteInput}
      {renderNoteCards}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<NotesPageProps> = async (
  context
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: PageLinks.landingPage,
      },
    };
  }

  const userNotes: NoteType[] = await get(
    `${process.env.HOST}${ApiLinks.notes}`,
    context.req.headers.cookie!
  );

  return {
    props: {
      session: session,
      userNotes: userNotes,
    },
  };
};
