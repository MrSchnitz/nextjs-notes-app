"use client";
import React, { useState } from "react";
import { NoteType, NoteTypeEnum } from "@/models/Note";
import { CheckPointType } from "@/models/CheckPointObject";
import NoteCardCheckItem from "@/components/NoteCard/NoteCardCheckbox";
import clsx from "clsx";
import EditCardModal from "@/components/NoteCard/EditCardModal";

interface Props {
  note: NoteType;
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
}

export default function NoteCardItem({
  note,
  onEditNote,
  onDeleteNote,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleDeleteNote = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    onDeleteNote(id);
  };

  const handleOpenEditModal = (event: React.MouseEvent) => {
    event.stopPropagation()
    setOpenEditModal(true);
  }

  return (
    <>
      {openEditModal && (
        <EditCardModal
          note={note}
          onDelete={onDeleteNote}
          onClose={() => setOpenEditModal(false)}
          onEditNote={onEditNote}
        />
      )}
      <div
        className="px-4 py-3 border rounded-xl border-[#e0e0e0] bg-white w-[250px] h-fit relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleOpenEditModal}
      >
        <div className={clsx("absolute top-2 right-2", !hovered && "hidden")}>
          <button
            className="btn btn-sm btn-circle"
            onClick={(event) => handleDeleteNote(event, note.id!)}
          >
            <span className="material-icons-outlined">delete</span>
          </button>
        </div>
        <div className="font-bold">
          <span>{note.name}</span>
        </div>
        <div className="py-3">
          {note.noteType === NoteTypeEnum.TEXT ? (
            <p className="text-sm text-justify break-words">{note.content}</p>
          ) : (
            <div>
              {note.checkPoints
                ?.filter((f) => !f.checked)
                .map((cp: CheckPointType, i: number) => (
                  <NoteCardCheckItem
                    key={i}
                    checkItem={cp}
                    onChecked={() => {}}
                  />
                ))}
              {note.checkPoints?.find((f) => f.checked) && <hr />}
              {note.checkPoints
                ?.filter((f) => f.checked)
                .map((cp: CheckPointType, i: number) => (
                  <NoteCardCheckItem
                    key={i}
                    checkItem={cp}
                    onChecked={() => {}}
                  />
                ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          {note.tags?.map((tag) => (
            <div key={tag.id} className={clsx("badge badge-neutral")}>
              {tag.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
