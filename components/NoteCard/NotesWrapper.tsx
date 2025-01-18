"use client";
import MasonryLayout, {
  Item,
  SavedLayout,
} from "@/components/MansoryLayout/MasonryLayout";
import NoteCard from "@/components/NoteCard/NoteCard";
import React, { useState } from "react";
import { NoteType } from "@/models/Note";

type Props = {
  notes: NoteType[];
  layoutOrder: string[];
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
  onLayoutOrderChange?: (order: string[]) => void;
};

const NotesWrapper = ({
  notes,
  layoutOrder,
  onDeleteNote,
  onEditNote,
  onLayoutOrderChange,
}: Props) => {

  console.log("notes", notes, layoutOrder);

  const handleLayoutChange = (newLayout: SavedLayout) => {
    onLayoutOrderChange?.(newLayout.order);
  };

  const handleDeleteNote = (id: string) => {
    onDeleteNote(id);
  };

  const items: Item[] = notes.map((note, index) => ({
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
    <MasonryLayout
      items={items}
      gap={16}
      initialLayout={{ order: layoutOrder, positions: {} }}
      onLayoutChange={handleLayoutChange}
    />
  );
};

export default NotesWrapper;
