"use client";
import MasonryLayout, {
  Item,
  SavedLayout,
} from "@/components/MansoryLayout/MasonryLayout";
import React, { useState } from "react";
import { NoteType } from "@/models/Note";
import { TagType } from "@/models/Tag";
import EditNoteModalProvider from "@/components/NoteCard/EditNoteModalProvider";
import NoteCard from "@/components/NoteCard/NoteCard";

type Props = {
  notes: NoteType[];
  tags: TagType[];
  layoutOrder: string[];
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
  onLayoutOrderChange?: (order: string[]) => void;
};

const NotesWrapper = ({
  notes,
  tags,
  layoutOrder,
  onDeleteNote,
  onEditNote,
  onLayoutOrderChange,
}: Props) => {
  const handleLayoutChange = (newLayout: SavedLayout) => {
    onLayoutOrderChange?.(newLayout.order);
  };

  const handleDeleteNote = (id: string) => {
    onDeleteNote(id);
  };

  const unpinnedNotes = notes.filter((note) => !note.pinned);
  const pinnedNotes = notes.filter((note) => note.pinned);

  const unpinnedItems: Item[] = unpinnedNotes.map((note, index) => ({
    id: note.id ?? index.toString(),
    content: (
      <NoteCard
        key={note.id}
        note={note}
        onDeleteNote={handleDeleteNote}
        onEditNote={onEditNote}
      />
    ),
  }));

  const pinnedItems: Item[] = pinnedNotes.map((note, index) => ({
    id: note.id ?? index.toString(),
    content: (
      <NoteCard
        key={note.id}
        note={note}
        onDeleteNote={handleDeleteNote}
        onEditNote={onEditNote}
      />
    ),
  }));

  return (
    <EditNoteModalProvider
      tags={tags}
      onEditNote={onEditNote}
      onDeleteNote={handleDeleteNote}
    >
      <MasonryLayout
        items={pinnedItems}
        gap={16}
        initialLayout={{ order: layoutOrder, positions: {} }}
        onLayoutChange={handleLayoutChange}
      />
      <hr className="mt-4 mb-8" />
      <MasonryLayout
        items={unpinnedItems}
        gap={16}
        initialLayout={{ order: layoutOrder, positions: {} }}
        onLayoutChange={handleLayoutChange}
      />
    </EditNoteModalProvider>
  );
};

export default NotesWrapper;
