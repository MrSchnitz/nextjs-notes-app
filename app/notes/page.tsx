import React from "react";
import EditNote from "@/components/Note/EditNote/EditNote";
import "../globals.css";
import { getUser } from "@/repositories/NoteRepository";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PAGE_LINKS } from "@/lib/Links";
import { redirect } from "next/navigation";
import {
  handleAddNoteAction,
  handleDeleteNoteAction,
  handleEditNoteAction,
  handleUpdateNoteLayoutOrderAction,
} from "@/app/actions";
import NotesWrapper from "@/app/notes/NotesWrapper";
import NotesEmptyElement from "@/components/Note/NotesEmptyElement";

export default async function NotesPage() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGE_LINKS.landingPage);
  }

  const user = await getUser(session);
  const { notes, tags, noteOrder } = user;
  const parsedNoteOrder = noteOrder ? JSON.parse(noteOrder) : null;

  const areNotesEmpty = notes.length === 0;

  return (
    <div className="w-full h-page px-2 md:px-4 overflow-y-auto">
      <div className="sticky top-0 z-20 pt-16 pb-8 md:p-12 bg-white w-full flex justify-center">
        <EditNote onAddNote={handleAddNoteAction} tags={tags} />
      </div>
      {areNotesEmpty ? (
        <NotesEmptyElement />
      ) : (
        <NotesWrapper
          notes={notes}
          tags={tags}
          layoutOrder={parsedNoteOrder}
          onEditNote={handleEditNoteAction}
          onDeleteNote={handleDeleteNoteAction}
          onLayoutOrderChange={handleUpdateNoteLayoutOrderAction}
        />
      )}
    </div>
  );
}
