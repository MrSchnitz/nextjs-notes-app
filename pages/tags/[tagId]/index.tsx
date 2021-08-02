import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { NoteType } from "../../../models/Note";
import { TagsPageNoNotes, TagsPageNotes } from "./tags-page.styles";
import { useDispatch, useSelector } from "react-redux";
import NoteCard from "../../../components/NoteCard/note-card.component";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { get } from "../../../internals/RestAPI";
import useRouterRefresh from "../../../hooks/useRouterRefresh";
import {
  NotesAPI,
  selectCurrentRoute,
  selectEditNote,
  selectNote,
  selectSearchNotes,
  selectSearchNotesLoading,
} from "../../../API/NotesPageAPI/NotesAPI";
import { TagType } from "../../../models/Tag";
import { selectTags } from "../../../API/TagsAPI/TagsAPI";
import { ApiLinks, PageLinks } from "../../../internals/Links";
import { ChangeActionType } from "../../../internals/helpers";
import { CheckPointType } from "../../../models/CheckPoint";
import { useRouter } from "next/router";
import { Loading } from "../../../components/Loading/loading.component";

export interface TagsPageProps {
  session: Session | null;
  tagNotes: NoteType[];
}

export default function TagsPage({ session, tagNotes }: TagsPageProps) {
  const dispatch = useDispatch();

  const router = useRouter();

  const [notesToRender, setNotesToRender] = useState(tagNotes);

  const editNote = useSelector(selectEditNote);
  const currentRoute = useSelector(selectCurrentRoute);
  const tags: TagType[] = useSelector(selectTags);
  const searchNotes = useSelector(selectSearchNotes);
  const searchNotesLoading = useSelector(selectSearchNotesLoading);

  useEffect(() => {
    router.replace(router.asPath);
  }, [currentRoute]);

  useEffect(() => {
    if (searchNotes.length > 0) {
      setNotesToRender(searchNotes);
    } else {
      setNotesToRender(tagNotes);
    }
  }, [tagNotes, searchNotes]);

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

  return (
    <>
      {searchNotesLoading ? (
        <Loading size={30} />
      ) : notesToRender && notesToRender.length > 0 ? (
        <TagsPageNotes>
          {notesToRender.map((note: NoteType, k: number) => (
            <NoteCard
              key={note.id}
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
          ))}
        </TagsPageNotes>
      ) : (
        <TagsPageNoNotes>
          <h1>Sorry, no notes are available for this tag...</h1>
        </TagsPageNoNotes>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<TagsPageProps> = async (
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

  const { tagId } = context.query;

  const userNotes: NoteType[] = await get(
    `${process.env.HOST}${ApiLinks.tagsNotes}/${tagId}`,
    context.req.headers.cookie!
  );

  return {
    props: {
      session: session,
      tagNotes: userNotes,
    },
  };
};
