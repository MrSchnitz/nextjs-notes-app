"use client";
import React, {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NoteType, NoteTypeEnum } from "../../models/Note";
import { TagType } from "../../models/Tag";
import clsx from "clsx";

const HEIGHT_TRANSITION_DURATION = 500; // ms

const AddNodeButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <button
      type="button"
      className={clsx("btn btn-sm btn-ghost btn-circle", props.className)}
      {...props}
    />
  );
};

const SelectTagDropdown = ({
  tags,
  noteTags,
  addTag,
}: {
  tags?: TagType[];
  noteTags?: TagType[];
  addTag: (tag: TagType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const clickOutsideListener = useCallback(
    (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    },
    [isOpen],
  );

  useEffect(() => {
    document.addEventListener("click", clickOutsideListener);
    return () => {
      document.removeEventListener("click", clickOutsideListener);
    };
  }, [clickOutsideListener]);

  return (
    <div
      className={clsx("dropdown dropdown-bottom", isOpen && "dropdown-open")}
    >
      <AddNodeButton onClick={() => setIsOpen((prevState) => !prevState)}>
        <span className="material-icons-outlined">label</span>
      </AddNodeButton>
      {isOpen && (
        <ul
          className="dropdown-content menu bg-base-100 rounded-box z-20 w-52 p-2 shadow"
          ref={dropdownRef}
        >
          {tags?.map((tag) => (
            <li key={tag.id}>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={noteTags?.includes(tag)}
                  className="checkbox checkbox-sm"
                  onClick={() => addTag(tag)}
                />
                <span className="label-text text-base">{tag.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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

  const mainRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteType>();

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setNote((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddTag = (tag: TagType) => {
    setNote((prevState) => ({
      ...prevState,
      tags: prevState.tags?.includes(tag)
        ? prevState.tags?.filter((tagIndex) => tagIndex.id !== tag.id)
        : [...(prevState?.tags ?? []), tag],
    }));
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleOnClose = () => {
    setFocused(false);
    if (
      note.name.length > 0 ||
      note.content.length > 0 ||
      (note.checkPoints?.length ?? 0) > 0
    ) {
      onAddNote(note);
    }
  };

  const clickOutsideListener = useCallback(
    (e: MouseEvent) => {
      if (!(mainRef.current! as any).contains(e.target)) {
        if (focused) {
          handleOnClose();
        }
      }
    },
    [note, focused],
  );

  useEffect(() => {
    document.addEventListener("click", clickOutsideListener);
    return () => {
      document.removeEventListener("click", clickOutsideListener);
    };
  }, [clickOutsideListener]);

  // useLayoutEffect(() => {
  //   if (!nameInputRef?.current || !bodyRef?.current) {
  //     return;
  //   }
  //   // if (focused) {
  //   nameInputRef.current.style.maxHeight = `${nameInputRef.current.scrollHeight}px`;
  //   bodyRef.current.style.maxHeight = `${bodyRef.current.scrollHeight}px`;
  //   // } else {
  //   //   nameInputRef.current.style.maxHeight = "0px";
  //   //   bodyRef.current.style.maxHeight = "48px";
  //   // }
  // }, [focused]);

  return (
    <div
      className={clsx(
        "flex flex-col px-4 py-3 rounded-lg shadow-[0_1px_2px_0_rgba(60,64,67,0.302),0_2px_6px_2px_rgba(60,64,67,0.149)] min-w-[600px]",
      )}
      ref={mainRef}
    >
      <div
        className="relative transition-[max-height] overflow-hidden"
        style={{ transitionDuration: `${HEIGHT_TRANSITION_DURATION}ms` }}
        // ref={nameInputRef}
      >
        {focused && (
          <input
            className="w-full mb-3 font-bold"
            placeholder="Name"
            name="name"
            onChange={handleChange}
          />
        )}
        <AddNodeButton
          className="absolute top-0 right-0"
          onClick={() =>
            setNote((prevState) => ({
              ...prevState,
              pinned: !prevState.pinned,
            }))
          }
        >
          <span
            className={clsx(
              note.pinned ? "material-icons" : "material-icons-outlined",
            )}
          >
            push_pin
          </span>
        </AddNodeButton>
      </div>
      <div
        className="grid transition-[max-height]"
        style={{ transitionDuration: `${HEIGHT_TRANSITION_DURATION}ms` }}
        // ref={bodyRef}
      >
        <textarea
          className={clsx(
            "w-full resize-none",
            focused ? "mb-3 resize" : "font-bold",
          )}
          placeholder="Create a note..."
          onClick={handleFocus}
          rows={focused ? 5 : 1}
          name="content"
          onChange={handleChange}
        />
        {focused && (
          <>
            <div className="flex items-center gap-x-2">
              {note.tags?.map((tag) => (
                <div className="badge badge-neutral">{tag.name}</div>
              ))}
            </div>
            <div className="flex items-center gap-x-2">
              <AddNodeButton>
                <span className="material-icons-outlined">palette</span>
              </AddNodeButton>
              <AddNodeButton>
                <span className="material-icons-outlined">check_box</span>
              </AddNodeButton>
              <AddNodeButton>
                <span className="material-icons-outlined">image</span>
              </AddNodeButton>
              <SelectTagDropdown
                tags={tags}
                noteTags={note.tags}
                addTag={handleAddTag}
              />
              <div className="w-full flex items-center justify-end">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={handleOnClose}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(AddNote);
