"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NoteType, NoteTypeEnum } from "../../models/Note";
import { TagType } from "../../models/Tag";
import clsx from "clsx";

export interface AddNoteProps {
  tags?: TagType[];
  onAddNote: (note: NoteType) => void;
  edit?: boolean;
}

const AddNote: React.FC<AddNoteProps> = ({
  onAddNote,
  tags,
  edit,
}: AddNoteProps) => {
  const [focused, setFocused] = useState<boolean>(!!edit);
  const [note, setNote] = useState<NoteType>({
    name: "",
    content: "",
    tags: [],
    noteType: NoteTypeEnum.TEXT,
    checkPoints: [],
    color: "",
    createdAt: "",
    pinned: false,
  });

  const mainRef = useRef(null);

  const clickOutsideListener = useCallback(
    (e: MouseEvent) => {
      if (!(mainRef.current! as any).contains(e.target)) {
        setFocused(false);
      }
    },
    [note],
  );

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

  // const onSubmit: SubmitHandler<NoteType> = (data) => onAddNote();

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setNote((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const addTag = (tag: TagType) => {
    setNote((prevState) => ({
      ...prevState,
      tags: prevState.tags?.includes(tag)
        ? prevState.tags?.filter((tagIndex) => tagIndex.id !== tag.id)
        : [...(prevState?.tags ?? []), tag],
    }));
  };

  const onClose = () => {
    setFocused(false);
    onAddNote(note);
  };

  return (
    <div
      className={clsx(
        "px-4 py-3 rounded-xl shadow-[0_1px_2px_0_rgba(60,64,67,0.302),0_2px_6px_2px_rgba(60,64,67,0.149)] min-w-[500px]",
      )}
      ref={mainRef}
    >
      {focused && (
        <input
          className="w-full mb-3"
          placeholder="Name"
          name="name"
          onChange={handleChange}
        />
      )}
      <textarea
        className={clsx("w-full resize-none", focused && "mb-3 resize")}
        placeholder="Create a note..."
        onClick={() => setFocused(true)}
        rows={focused ? 5 : 1}
        name="content"
        onChange={handleChange}
      />
      {focused && (
        <>
          <div className="flex items-center gap-x-2">
            {tags?.map((tag) => (
              <div
                className={clsx(
                  "badge hover:badge-outline cursor-pointer",
                  note.tags?.includes(tag) && "badge-neutral",
                )}
                onClick={() => addTag(tag)}
              >
                {tag.name}
              </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-end">
            <button className="" onClick={onClose}>
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(AddNote);
