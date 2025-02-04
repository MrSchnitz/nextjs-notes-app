"use client";
import React, { useState } from "react";
import { NoteType, NoteTypeEnum } from "@/models/Note";
import { CheckPointType } from "@/models/CheckPointObject";
import NoteCardCheckItem from "@/components/Note/NoteCard/NoteCardCheckbox";
import clsx from "clsx";
import { useEditNoteModalContext } from "@/components/Note/EditNoteModalProvider";
import EditNotePinButton from "@/components/Note/EditNote/components/EditNotePinButton";

interface Props {
  note: NoteType;
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
}

export default function NoteCard({ note, onEditNote, onDeleteNote }: Props) {
  const [hovered, setHovered] = useState(false);

  const { setEditNote } = useEditNoteModalContext();

  const handleDeleteNote = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    onDeleteNote(id);
  };

  const handleCheckItem = (checkItem: CheckPointType) => {
    const newNote = { ...note };
    newNote.checkPoints = note.checkPoints?.map((cp) =>
      cp.id === checkItem.id ? checkItem : cp,
    );
    onEditNote?.(newNote);
  };

  const handlePinChange = (isPinned: boolean) => {
    const newNote = { ...note, pinned: isPinned };
    onEditNote?.(newNote);
  };

  const checkedCheckPoints = note.checkPoints?.filter((cp) => cp.checked) ?? [];
  const uncheckedCheckPoints =
    note.checkPoints?.filter((cp) => !cp.checked) ?? [];
  const showSeparator =
    checkedCheckPoints.length > 0 && uncheckedCheckPoints.length > 0;

  return (
    <>
      <div
        className="px-4 py-3 border rounded-xl border-[#e0e0e0] bg-white w-full md:w-[250px] h-fit relative cursor-pointer"
        style={{ backgroundColor: note.color }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setEditNote?.(note)}
      >
        {note.image && (
          <div className="-mt-3 -mx-4 mb-3 rounded-t-xl overflow-hidden">
            <img
              src={note.image}
              className="object-center object-cover"
              alt=""
            />
          </div>
        )}
        <div
          className={clsx(
            "absolute top-2 right-2 flex items-center transition-opacity duration-500",
            !hovered && "opacity-0",
          )}
        >
          <EditNotePinButton
            isPinned={note.pinned}
            onPinChange={handlePinChange}
          />
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={(event) => handleDeleteNote(event, note.id!)}
          >
            <span className="material-icons-outlined">delete</span>
          </button>
        </div>
        <div className="font-bold">
          <span>{note.name}</span>
        </div>
        <div className="pt-3">
          {note.noteType === NoteTypeEnum.TEXT ? (
            <p className="w-full text-sm text-justify break-words">
              {note.content}
            </p>
          ) : (
            <>
              {uncheckedCheckPoints.map((cp: CheckPointType, i: number) => (
                <NoteCardCheckItem
                  key={i}
                  checkItem={cp}
                  onChecked={handleCheckItem}
                />
              ))}
              {showSeparator && <hr />}
              {checkedCheckPoints.map((cp: CheckPointType, i: number) => (
                <NoteCardCheckItem
                  key={i}
                  checkItem={cp}
                  onChecked={handleCheckItem}
                />
              ))}
            </>
          )}
        </div>
        {note.tags?.length !== 0 && (
          <div className="flex items-center flex-wrap gap-2 mt-2">
            {note.tags?.map((tag) => (
              <div key={tag.id} className={clsx("badge badge-neutral")}>
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
