import React from "react";
import EditNote from "@/components/EditNote/EditNote";
import "../globals.css";
import { NoteType } from "@/models/Note";
import {
  addNewNote,
  deleteNote,
  getUser,
  updateNote,
  updateNoteOrder,
} from "@/repositories/NoteRepository";
import { revalidatePath } from "next/cache";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PAGE_LINKS } from "@/lib/Links";
import { redirect } from "next/navigation";
import NotesWrapper from "@/components/NoteCard/NotesWrapper";

export default async function NotesPage() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGE_LINKS.landingPage);
  }

  const user = session ? await getUser(session) : [];
  const { notes, tags, noteOrder } = user;
  const parsedNoteOrder = noteOrder ? JSON.parse(noteOrder) : null;

  const handleUpdateNoteLayoutOrder = async (order: string[]) => {
    "use server";
    if (session) {
      try {
        await updateNoteOrder(session, JSON.stringify(order));
        // revalidatePath("/");
      } catch (error) {
        console.log("Update note order went wrong", error);
      }
    }
  };

  const handleAddNote = async (note: NoteType) => {
    "use server";
    if (session) {
      try {
        await addNewNote(note, session);
        revalidatePath(PAGE_LINKS.notesPage);
      } catch (error) {
        console.log("Add note went wrong", error);
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    "use server";
    if (session) {
      try {
        await deleteNote(id, session);
        revalidatePath(PAGE_LINKS.notesPage);
      } catch (error) {
        console.log("Delete note went wrong", error);
      }
    }
  };

  const handleEditNote = async (note: NoteType) => {
    "use server";
    if (session) {
      try {
        await updateNote(note);
        revalidatePath(PAGE_LINKS.notesPage);
      } catch (error) {
        console.log("Edit note went wrong", error);
      }
    }
  };

  const NotesEmptyElement = (
    <div className="w-full h-full flex justify-center items-center text-center text-4xl font-bold">
      <h1>Sorry, no notes are available...</h1>
    </div>
  );

  const areNotesEmpty = notes.length === 0;

  return (
    <div className="py-8 px-2 md:px-16 h-full">
      <div className="pt-8 pb-8 md:p-12 w-full flex justify-center">
        <EditNote onAddNote={handleAddNote} tags={tags} />
      </div>
      {areNotesEmpty ? (
        NotesEmptyElement
      ) : (
        <NotesWrapper
          notes={notes}
          tags={tags}
          layoutOrder={parsedNoteOrder}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onLayoutOrderChange={handleUpdateNoteLayoutOrder}
        />
      )}
    </div>
  );
}
