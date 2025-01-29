"use client";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import Modal from "@/components/Modal/Modal";
import { NoteType } from "@/models/Note";
import EditNote from "@/components/Note/EditNote/EditNote";
import { TagType } from "@/models/Tag";

type EditModalContextType = {
  editNote: NoteType | null;
  setEditNote: (note: NoteType) => void;
};

const EditNoteModalContext = createContext<EditModalContextType>({
  editNote: null,
  setEditNote: () => {},
});

export const useEditNoteModalContext = () => useContext(EditNoteModalContext);

export default function EditNoteModalProvider({
  children,
  tags,
  onEditNote,
  onDeleteNote,
}: PropsWithChildren<{
  tags: TagType[];
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
}>) {
  const [editNote, setEditNote] = useState<NoteType | null>(null);

  const handleOnEditNote = (note: NoteType) => {
    onEditNote?.(note);
    setEditNote?.(null);
  };

  const handleCloseModal = () => {
    setEditNote?.(null);
  };

  const handleSetNote = (note: NoteType) => {
    setEditNote?.({ ...note });
  };

  const handleDeleteNote = (id: string) => {
    onDeleteNote?.(id);
    setEditNote?.(null);
  };

  return (
    <>
      {editNote && (
        <Modal className="w-full max-w-[600px]" onClose={handleCloseModal}>
          <EditNote
            defaultNote={editNote}
            tags={tags}
            onAddNote={handleOnEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </Modal>
      )}
      <EditNoteModalContext.Provider
        value={{ editNote, setEditNote: handleSetNote }}
      >
        {children}
      </EditNoteModalContext.Provider>
    </>
  );
}
