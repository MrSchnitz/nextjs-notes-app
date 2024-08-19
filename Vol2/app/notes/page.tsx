import {
  NotesPageAddNote,
  NotesPageNoNotes,
} from "@/views/notes/notes-page.styles";
import React from "react";
import AddNote from "../../components/AddNote/AddNote";
import "../globals.css";
import { NoteType } from "@/models/Note";
import NoteCard from "@/components/NoteCard/NoteCard";
import {
  addNewNote,
  deleteNote,
  getAllUserNotes,
} from "@/repositories/NoteRepository";
import { revalidatePath } from "next/cache";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllUserTags } from "@/repositories/TagRepository";

export default async function NotesPage() {
  const session: Session | null = await getServerSession(authOptions);

  const notes = session ? await getAllUserNotes(session) : [];
  const tags = session ? await getAllUserTags(session) : [];

  const handleAddNote = async (note: NoteType) => {
    "use server";
    if (session) {
      await addNewNote(note, session);

      revalidatePath("/notes");
    }
  };

  const handleDeleteNote = async (id: string) => {
    "use server";
    if (session) {
      await deleteNote(id);

      revalidatePath("/notes");
    }
  };

  const renderAddNoteInput = (
    <div className="p-12 w-full flex justify-center">
      <AddNote onAddNote={handleAddNote} tags={tags} />
    </div>
  );

  // const renderNoteCards = isLoading ? (
  //   <Loading size={30} />
  // ) : notes.length > 0 ? (
  //   // <div className="flex flex-col flex-wrap max-h-[1000px] items-center w-fit">
  //   <div className="masonry">
  //     {notes.map((note: NoteType) => (
  //       <NoteCard note={note} key={note.id} />
  //     ))}
  //   </div>
  // ) : (
  //   // </div>
  //   <NotesPageNoNotes>
  //     <h1>Sorry, no notes are available...</h1>
  //   </NotesPageNoNotes>
  // );

  const renderNoteCards =
    notes.length > 0 ? (
      <div className="flex justify-center w-full">
        <div className="flex flex-col flex-wrap max-h-[1000px] items-center w-fit">
          {notes.map((note) => (
            <NoteCard note={note} key={note.id} onDelete={handleDeleteNote} />
          ))}
        </div>
      </div>
    ) : (
      <div className="w-full h-full flex justify-center items-center text-center text-4xl font-bold">
        <h1>Sorry, no notes are available...</h1>
      </div>
    );

  return (
    <>
      {renderAddNoteInput}
      {renderNoteCards}
    </>
  );
}
