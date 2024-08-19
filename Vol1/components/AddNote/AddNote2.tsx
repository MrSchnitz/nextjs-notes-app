import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChangeActionType } from "../../lib/helpers";
import { SubmitHandler, useForm } from "react-hook-form";
import { cNoteModel, NoteType, NoteTypeEnum } from "../../models/Note";
import { TagType } from "../../models/Tag";
import clsx from "clsx";

export interface AddNoteProps {
  onHandleChange: (action: ChangeActionType) => void;
  noteModel: NoteType;
  tags?: TagType[];
  onAddNote: () => void;
  onClick?: () => void;
  edit?: boolean;
}

const AddNote: React.FC<AddNoteProps> = ({
  onHandleChange,
  noteModel,
  onAddNote,
  tags,
  edit,
  onClick,
}: AddNoteProps) => {
  const [focused, setFocused] = useState<boolean>(!!edit);

  const mainRef = useRef(null);

  const clickOutsideListener = useCallback((e: MouseEvent) => {
    if (!(mainRef.current! as any).contains(e.target)) {
      setFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", clickOutsideListener);
    return () => {
      document.removeEventListener("click", clickOutsideListener);
    };
  }, [clickOutsideListener]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteType>();

  const onSubmit: SubmitHandler<NoteType> = (data) => onAddNote();

  const handleChangeNoteType = (e: any, noteType: NoteTypeEnum) => {
    onHandleChange({
      attr: cNoteModel.noteType,
      value: noteType,
    });
    e.stopPropagation();
  };

  return (
    <div className={clsx("px-4 py-3 rounded-xl")}>
      {focused && <input className="w-full mb-3" placeholder="Name" />}
      <input
        className={clsx("w-80 mb-3")}
        placeholder="Create a note..."
        onClick={() => setFocused(true)}
      />
      {focused && (
        <div className="w-full flex items-center justify-between">
          <button className="">Close</button>
        </div>
      )}
    </div>
  );
};

export default React.memo(AddNote);
