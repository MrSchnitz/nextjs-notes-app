import React, { ChangeEvent, useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";
import { NoteType, NoteTypeEnum } from "@/models/Note";
import { CheckPointType } from "@/models/CheckPointObject";
import NoteCardCheckItem from "@/components/NoteCard/NoteCardCheckbox";
import clsx from "clsx";
import { TagType } from "@/models/Tag";

interface Props {
  note: NoteType;
  onDelete: (id: string) => void;
  onEditNote: (note: NoteType) => void;
  onClose?: () => void;
}

export default function EditCardModal({
  note,
  onDelete,
  onEditNote,
  onClose,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [editNote, setEditNote] = useState<NoteType>(note);

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setEditNote((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditTag = (tag: TagType) => {
    setEditNote((prevState) => ({
      ...prevState,
      tags: prevState.tags?.includes(tag)
        ? prevState.tags?.filter((tagIndex) => tagIndex.id !== tag.id)
        : [...(prevState?.tags ?? []), tag],
    }));
  };

  const handleOnClose = () => {
    if (
      editNote.name !== note.name ||
      editNote.content !== note.content ||
      editNote.checkPoints?.length !== note.checkPoints?.length
    ) {
      onEditNote(editNote);
    }
    onClose?.();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleOnClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Modal onClose={onClose}>
      <div
        className="px-4 py-3 border rounded-xl border-[#e0e0e0] bg-white w-[300px] h-fit relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={clsx("absolute top-2 right-2", !hovered && "hidden")}>
          <button
            className="btn btn-circle btn-sm"
            onClick={() => onDelete(note.id!)}
          >
            <span className="material-icons-outlined">delete</span>
          </button>
        </div>
        <div className="font-bold">
          <input
            name="name"
            className="text-sm text-justify w-full"
            value={editNote.name}
            onChange={handleChange}
          />
        </div>
        <div className="py-3">
          {editNote.noteType === NoteTypeEnum.TEXT ? (
            <textarea
              name="content"
              className="text-sm text-justify w-full"
              value={editNote.content}
              onChange={handleChange}
            />
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
            <div
              key={tag.id}
              className={clsx(
                "badge hover:badge-outline cursor-pointer",
                editNote.tags?.includes(tag) && "badge-neutral",
              )}
              onClick={() => handleEditTag(tag)}
            >
              {tag.name}
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-end">
          <button className="btn btn-sm" onClick={handleOnClose}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
