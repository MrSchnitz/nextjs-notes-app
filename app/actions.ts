"use server";
import {
  addNewNote,
  deleteNote,
  updateNote,
  updateNoteOrder,
} from "@/repositories/NoteRepository";
import { NoteType } from "@/models/Note";
import { revalidatePath } from "next/cache";
import { PAGE_LINKS } from "@/lib/Links";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const handleUpdateNoteLayoutOrderAction = async (order: string[]) => {
  const session: Session | null = await getServerSession(authOptions);
  if (session) {
    try {
      await updateNoteOrder(session, JSON.stringify(order));
    } catch (error) {
      console.log("Update note order went wrong", error);
    }
  }
};

export const handleAddNoteAction = async (note: NoteType | null) => {
  console.log("HELLO", note)
  const session: Session | null = await getServerSession(authOptions);
  if (session && note) {
    try {
      await addNewNote(note, session);
      revalidatePath(PAGE_LINKS.notesPage);
    } catch (error) {
      console.log("Add note went wrong", error);
    }
  }
};

export const handleDeleteNoteAction = async (id: string) => {
  const session: Session | null = await getServerSession(authOptions);
  if (session) {
    try {
      await deleteNote(id, session);
      revalidatePath(PAGE_LINKS.notesPage);
    } catch (error) {
      console.log("Delete note went wrong", error);
    }
  }
};

export const handleEditNoteAction = async (note: NoteType) => {
  const session: Session | null = await getServerSession(authOptions);
  if (session) {
    try {
      await updateNote(note);
      revalidatePath(PAGE_LINKS.notesPage);
    } catch (error) {
      console.log("Edit note went wrong", error);
    }
  }
};
