"use client";
import React, { useState } from "react";
import { NoteType } from "@/models/Note";
import { TagType } from "@/models/Tag";
import EditNoteModalProvider from "@/components/Note/EditNoteModalProvider";
import NoteCard from "@/components/Note/NoteCard/NoteCard";
import MasonryLayoutDnD from "@/components/MansoryLayout/MasonryLayout";
import { MasonryItem } from "@/components/MansoryLayout/MasonryLayout";

function getSortedNotes(notes: NoteType[], layoutOrder: string[]) {
  const sortedNotes = [...notes].sort(
    (a, b) => layoutOrder.indexOf(a.id ?? "") - layoutOrder.indexOf(b.id ?? ""),
  );

  return {
    pinned: sortedNotes.filter((note) => note.pinned),
    unpinned: sortedNotes.filter((note) => !note.pinned),
  };
}

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
  const [noteLayoutOrder, setNoteLayoutOrder] = useState<string[]>(layoutOrder);

  const sortedNotes = getSortedNotes(notes, noteLayoutOrder);

  const getMasonryItems = (notes: NoteType[]): MasonryItem[] => {
    return notes.map((note, index) => ({
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
  };

  const handleReorder = (
    newOrderItems: MasonryItem[],
    prop: "pinned" | "unpinned",
  ) => {
    const newItems = {
      ...sortedNotes,
      [prop]: newOrderItems,
    };

    const newOrder = [
      ...newItems.pinned.map((item) => item.id ?? ""),
      ...newItems.unpinned.map((item) => item.id ?? ""),
    ];

    setNoteLayoutOrder(newOrder);
    onLayoutOrderChange?.(newOrder);
  };

  return (
      <EditNoteModalProvider
          tags={tags}
          onEditNote={onEditNote}
          onDeleteNote={onDeleteNote}
      >
        <h2 className="text-sm ml-6 mb-4 uppercase tracking-wider font-semibold text-gray-800">pinned</h2>
        <MasonryLayoutDnD
            items={getMasonryItems(sortedNotes.pinned)}
            gap={4}
            onReorder={(newItems) => handleReorder(newItems, "pinned")}
        />
        <hr className="mt-4 mb-8 md:my-10"/>
        <h2 className="text-sm ml-6 mb-4 uppercase tracking-wider font-semibold text-gray-800">unpinned</h2>
        <MasonryLayoutDnD
            items={getMasonryItems(sortedNotes.unpinned)}
            gap={4}
            onReorder={(newItems) => handleReorder(newItems, "unpinned")}
        />
      </EditNoteModalProvider>
  );
};

export default NotesWrapper;
