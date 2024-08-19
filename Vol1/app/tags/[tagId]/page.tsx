"use client";
import React, { useEffect, useState } from "react";
import { NoteType } from "../../../models/Note";
import {
  TagsPageNoNotes,
  TagsPageNotes,
} from "../../../views/tags/[tagId]/tags-page.styles";
import { useDispatch, useSelector } from "react-redux";
import NoteCard from "../../../components/NoteCard/note-card.component";
import { GetServerSideProps } from "next";
import { get } from "../../../lib/RestAPI";
import {
  NotesAPI,
  selectCurrentRoute,
  selectEditNote,
  selectSearchNotes,
  selectSearchNotesLoading,
} from "../../../API/NotesPageAPI/NotesAPI";
import { TagType } from "../../../models/Tag";
import { selectTags } from "../../../API/TagsAPI/TagsAPI";
import { ApiLinks, PageLinks } from "../../../lib/Links";
import { ChangeActionType } from "../../../lib/helpers";
import { CheckPointType } from "../../../models/CheckPointObject";
import { useRouter } from "next/router";
import { Loading } from "../../../components/Loading/loading.component";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default async function TagsPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.replace(PageLinks.landingPage);
  }
  const dispatch = useDispatch();

  const tagNotes: NoteType[] = await get(
    `${process.env.HOST}${ApiLinks.tagsNotes}/${params.tagId}`,
  );

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
    checkitem: CheckPointType,
  ) => {
    dispatch(NotesAPI.checkNoteAndSubmit({ note: note, checkitem: checkitem }));
  };

  return (
    <>
      <Head>
        <title>Tag notes</title>
      </Head>
      {searchNotesLoading ? (
        <Loading size={30} classname="mt-4" />
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

// export const getServerSideProps: GetServerSideProps<TagsPageProps> = async (
//   context,
// ) => {
//   const session = await getSession(context);
//
//   if (!session) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: PageLinks.landingPage,
//       },
//     };
//   }
//
//   const { tagId } = context.query;
//
//   const userNotes: NoteType[] = await get(
//     `${process.env.HOST}${ApiLinks.tagsNotes}/${tagId}`,
//     context.req.headers.cookie!,
//   );
//
//   return {
//     props: {
//       session: session,
//       tagNotes: userNotes,
//     },
//   };
// };
