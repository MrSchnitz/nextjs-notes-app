"use client";
import React, { useEffect, useState } from "react";
import { NoteType } from "@/models/Note";
import { TagType } from "@/models/Tag";
import EditNoteModalProvider from "@/components/Note/EditNoteModalProvider";
import NoteCard from "@/components/Note/NoteCard/NoteCard";
import MasonryLayoutDnD from "@/components/MansoryLayout/MasonryLayout";
import { NotesSkeletonLoader } from "@/components/SkeletonLoading/SkeletonLoading";

type Props = {
  notes: NoteType[];
  tags: TagType[];
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
};

const TagNotesWrapper = ({ notes, tags, onDeleteNote, onEditNote }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const items = notes.map((note, index) => ({
    id: note.id ?? index.toString(),
    content: (
      <NoteCard
        note={note}
        onEditNote={onEditNote}
        onDeleteNote={onDeleteNote}
      />
    ),
    order: index,
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <NotesSkeletonLoader />;
  }

  return (
    <EditNoteModalProvider tags={tags}>
      <MasonryLayoutDnD items={items} gap={4} />
    </EditNoteModalProvider>
  );
};

export default TagNotesWrapper;
