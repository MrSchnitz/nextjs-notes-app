import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { NoteType, NoteTypeEnum } from "@/models/Note";
import { CheckPointType } from "@/models/CheckPointObject";
import NoteCardCheckItem from "@/components/NoteCard/NoteCardCheckbox";
import clsx from "clsx";

interface Props {
  note: NoteType;
  onDelete: (id: string) => void;
}

export default function EditCardModal({ note, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Modal>
      <div
        className="px-4 py-3 border rounded-xl border-[#e0e0e0] bg-white w-[200px] h-fit m-2 relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={clsx("absolute top-2 right-2", !hovered && "hidden")}>
          <button className="btn btn-sm" onClick={() => onDelete(note.id!)}>
            Delete
          </button>
        </div>
        <div className="font-bold">
          <span>{note.name}</span>
        </div>
        <div className="py-3">
          {note.noteType === NoteTypeEnum.TEXT ? (
            <div className="text-sm text-justify">{note.content}</div>
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
    </Modal>
  );
}
