import { getTagNotes } from "@/repositories/TagRepository";
import NoteCard from "@/components/NoteCard/NoteCard";
import React from "react";

export default async function Tags({
  params: { id },
}: {
  params: { id: string };
}) {
  const tagNotes = await getTagNotes(id);

  return (
    <main className="h-full flex justify-center p-12">
      {tagNotes.length > 0 ? (
        tagNotes.map((note) => <NoteCard key={note.id} note={note} />)
      ) : (
        <div className="w-full h-full flex justify-center items-center text-center text-4xl font-bold">
          <h1>Sorry, no notes are available...</h1>
        </div>
      )}
    </main>
  );
}
