"use client";
import React from "react";
import { NoteType } from "@/models/Note";
import NoteCardItem from "@/components/NoteCard/NoteCardItem";

interface Props {
  note: NoteType;
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
}

export default function NoteCard({ note, onEditNote, onDeleteNote }: Props) {

  return (
    <NoteCardItem
      note={note}
      onEditNote={onEditNote}
      onDeleteNote={onDeleteNote}
    />
  );
}
