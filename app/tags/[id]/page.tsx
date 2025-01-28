import { getTagPageItems } from "@/repositories/TagRepository";
import React from "react";
import TagNotesWrapper from "@/app/tags/TagNotesWrapper";
import NotesEmptyElement from "@/components/Note/NotesEmptyElement";
import { handleDeleteNote, handleEditNote } from "@/app/actions";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PAGE_LINKS } from "@/lib/Links";

export default async function Tags({
  params: { id },
}: {
  params: { id: string };
}) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGE_LINKS.landingPage);
  }

  const { notes, tags } = await getTagPageItems(id, session);

  if (notes.length === 0) {
    return <NotesEmptyElement />;
  }

  return (
    <div className="py-8 px-2 md:p-16  h-full w-full">
      <TagNotesWrapper
        notes={notes}
        tags={tags}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}
