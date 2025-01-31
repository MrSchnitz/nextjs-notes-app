"use client";
import React, {
  ChangeEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { EMPTY_NOTE, NoteError, NoteType, NoteTypeEnum } from "@/models/Note";
import { TagType } from "@/models/Tag";
import clsx from "clsx";
import { CheckPointType } from "@/models/CheckPointObject";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import { ImageInput } from "@/components/ImageInput/ImageInput";
import { ImageInputViewer } from "@/components/ImageInput/ImageInputViewer";
import useClickOutside from "@/lib/hooks/useClickOutside";
import SelectTagDropdown from "@/components/Note/EditNote/components/SelectTagDropdown";
import EditNoteBody from "@/components/Note/EditNote/components/EditNoteBody";
import EditNoteFooter from "@/components/Note/EditNote/components/EditNoteFooter";
import EditNotePinButton from "@/components/Note/EditNote/components/EditNotePinButton";
import AnimatedHeight from "@/components/AnimatedHeight/AnimatedHeight";
import GhostCircleButton from "@/components/GhostCircleButton/GhostCircleButton";

function checkAndGetNoteToSave(note: NoteType) {
  if (
    note.name.length > 0 ||
    note.content.length > 0 ||
    (note.checkPoints?.length ?? 0) > 0
  ) {
    const newNote = { ...note };
    if (note.noteType === NoteTypeEnum.CHECK) {
      newNote.checkPoints = newNote.checkPoints?.filter(
        (cp) => cp.text !== null,
      );
      newNote.content = "";
    } else {
      newNote.checkPoints = [];
    }

    return newNote;
  }

  return null;
}

export const ADD_NOTE_TRANSITION_DURATION = 500; // ms

export interface AddNoteProps {
  tags?: TagType[];
  defaultNote?: NoteType;
  onAddNote: (note: NoteType) => void;
  onDeleteNote?: (id: string) => void;
  onClose?: () => void;
}

const EditNote = ({
  onAddNote,
  tags,
  defaultNote,
  onDeleteNote,
  onClose,
}: AddNoteProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(!!defaultNote);
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);
  const [note, setNote] = useState<NoteType>(
    defaultNote ? { ...defaultNote } : EMPTY_NOTE,
  );
  const mainRef = useRef<HTMLDivElement>(null);
  const [error, action, isPending] = useActionState<
    (NoteType & NoteError) | null,
    NoteType
  >((_, payload) => onAddNote(payload) as never, null);

  const handleSetNoteProp = (prop: string, value: any) => {
    setNote((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    handleSetNoteProp(event.target.name, event.target.value);
  };

  const handleCheckPointChange = (newCheckPoints: CheckPointType[]) => {
    handleSetNoteProp("checkPoints", newCheckPoints);
  };

  const handlePinChange = (isPinned: boolean) => {
    handleSetNoteProp("pinned", isPinned);
  };

  const handleChangeColor = (color: string) => {
    handleSetNoteProp("color", color);
  };

  const handleChangeImage = (image: string) => {
    handleSetNoteProp("image", image);
  };

  const handleFocus = () => {
    if (defaultNote === undefined) {
      setIsFocused(true);
    }
  };

  const handleAddTag = (tag: TagType) => {
    const currentNoteTags = note.tags ?? [];
    const newTags = currentNoteTags.find(
      (currentTag) => currentTag.id === tag.id,
    )
      ? currentNoteTags.filter((tagIndex) => tagIndex.id !== tag.id)
      : [...currentNoteTags, tag];

    handleSetNoteProp("tags", newTags);
  };

  const handleChangeNoteType = () => {
    setNote((prevState) => ({
      ...prevState,
      noteType:
        prevState.noteType === NoteTypeEnum.TEXT
          ? NoteTypeEnum.CHECK
          : NoteTypeEnum.TEXT,
      checkPoints:
        prevState.noteType === NoteTypeEnum.TEXT &&
        prevState.checkPoints?.length === 0
          ? [{ text: null, checked: false }]
          : prevState.checkPoints,
    }));
  };

  const handleOnClose = () => {
    if (
      defaultNote !== undefined &&
      JSON.stringify(note) === JSON.stringify(defaultNote)
    ) {
      onClose?.();
      return;
    }

    const newNote = checkAndGetNoteToSave(note);

    if (newNote) {
      startTransition(() => {
        action(newNote);
        setWasSubmitted(true);
      });
    }

    setIsFocused(false);
    setNote(EMPTY_NOTE);
    onClose?.();
  };

  useEffect(() => {
    if (!isPending && !error?.message && isFocused && wasSubmitted) {
      if (defaultNote === undefined) {
        setIsFocused(false);
        setNote(EMPTY_NOTE);
      }
      onClose?.();
    }
  }, [isPending, error]);

  useClickOutside({
    ref: mainRef,
    onClickOutside: () => {
      if (isFocused && defaultNote === undefined) {
        handleOnClose();
      }
    },
  });

  const isTransitionDisabled = defaultNote !== undefined;

  return (
    <div
      className={clsx(
        "flex flex-col px-4 py-3 rounded-lg bg-white shadow-[0_1px_2px_0_rgba(60,64,67,0.302),0_2px_6px_2px_rgba(60,64,67,0.149)] w-full max-w-[600px] transition-colors",
        isPending && "pointer-events-none",
      )}
      style={{ backgroundColor: note.color }}
      ref={mainRef}
    >
      <AnimatedHeight
        duration={ADD_NOTE_TRANSITION_DURATION}
        toggle={!!note.image}
        className={clsx(!!note.image && "-mt-3 -mx-4 mb-4")}
      >
        {note.image && (
          <ImageInputViewer
            className="rounded-t-lg"
            imageData={note.image}
            onRemove={() => handleChangeImage("")}
          />
        )}
      </AnimatedHeight>
      <AnimatedHeight
        duration={ADD_NOTE_TRANSITION_DURATION}
        toggle={isFocused}
        disabled={isTransitionDisabled}
      >
        <input
          className="w-full mb-3 font-bold"
          placeholder="Name"
          name="name"
          value={note.name}
          onChange={handleChange}
        />
        <div className="absolute top-0 right-0 flex items-center gap-x-1">
          <EditNotePinButton
            isPinned={note.pinned}
            onPinChange={handlePinChange}
          />
          {onDeleteNote && note.id && (
            <GhostCircleButton onClick={() => onDeleteNote(note.id ?? "")}>
              <span className="material-icons-outlined">delete</span>
            </GhostCircleButton>
          )}
        </div>
      </AnimatedHeight>
      <EditNoteBody
        noteType={note.noteType}
        noteContent={note.content}
        checkPoints={note.checkPoints ?? []}
        isFocused={isFocused}
        onContentChange={handleChange}
        onCheckPointChange={handleCheckPointChange}
        onClick={handleFocus}
      />
      <AnimatedHeight
        duration={ADD_NOTE_TRANSITION_DURATION}
        toggle={isFocused}
        disabled={isTransitionDisabled}
      >
        <EditNoteFooter tags={note.tags ?? []}>
          <ColorPicker onChooseColor={handleChangeColor} />
          <GhostCircleButton
            onClick={handleChangeNoteType}
            isActive={note.noteType === NoteTypeEnum.CHECK}
          >
            <span className="material-icons-outlined">check_box</span>
          </GhostCircleButton>
          <ImageInput onFile={handleChangeImage} />
          <SelectTagDropdown
            tags={tags}
            noteTags={note.tags}
            addTag={handleAddTag}
          />
          <div className="w-full flex items-center justify-end">
            <button
              className="btn btn-sm btn-ghost"
              disabled={isPending}
              onClick={handleOnClose}
            >
              {isPending && (
                <span className="loading loading-sm loading-spinner"></span>
              )}
              Close
            </button>
          </div>
        </EditNoteFooter>
        {error?.message && <div className="text-red-500">{error.message}</div>}
      </AnimatedHeight>
    </div>
  );
};

export default EditNote;
