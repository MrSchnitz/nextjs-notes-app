import { NoteTypeEnum } from "@/models/Note";
import clsx from "clsx";
import React, { ChangeEvent, useRef } from "react";
import { CheckPointType } from "@/models/CheckPointObject";
import NoteCheckItem from "@/components/EditNote/components/NoteCheckItem";

type Props = {
  noteType: NoteTypeEnum;
  noteContent: string;
  checkPoints: CheckPointType[];
  isFocused: boolean;
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCheckPointChange: (newCheckPoints: CheckPointType[]) => void;
  onClick: () => void;
};

const EditNoteBody = ({
  noteType,
  noteContent,
  checkPoints,
  onContentChange,
  onCheckPointChange,
  isFocused,
  onClick,
}: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const checkPointRefs = useRef<Record<number, HTMLInputElement>>({});

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      textAreaRef.current.rows =
        (event.target.value.match(/\n/g) || []).length + 1;
    }
    onContentChange(event);
  };

  const handleChangeCheckpoint = (checkItem: CheckPointType, index: number) => {
    const newCheckPoints = [...checkPoints];
    newCheckPoints[index] = checkItem;

    if (index === checkPoints.length - 1 && checkPoints[index]?.text === null) {
      newCheckPoints.push({ text: null, checked: false });
    }

    onCheckPointChange(newCheckPoints);
  };

  const handleDeleteCheckpoint = (index: number) => {
    if (checkPoints.length === 1) {
      onCheckPointChange([{ text: null, checked: false }]);
      return;
    }

    onCheckPointChange(checkPoints.filter((_, i) => i !== index));

    checkPointRefs.current[index - 1]?.focus();
  };

  const handleOnEnter = (index: number) => {
    if (index !== checkPoints.length - 1) {
      checkPointRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "Enter":
        handleOnEnter(index);
        break;
      case "ArrowUp":
        checkPointRefs.current[index - 1]?.focus();
        break;
      case "ArrowDown":
        checkPointRefs.current[index + 1]?.focus();
        break;
    }
  };

  const refCallback = (element: HTMLInputElement | null, index: number) => {
    if (element) {
      checkPointRefs.current[index] = element;
    } else {
      delete checkPointRefs.current[index];
    }
  };

  const textAreaRows = (noteContent.match(/\n/g) || []).length + 1;

  return (
    <>
      {noteType === NoteTypeEnum.TEXT && (
        <textarea
          className={clsx(
            "w-full resize-none transition-[font-weight,margin] duration-500 placeholder:text-gray-700",
            isFocused ? "mb-3" : "font-bold",
          )}
          name="content"
          placeholder="Create a note..."
          rows={textAreaRows}
          value={noteContent}
          onClick={onClick}
          onChange={handleChange}
          ref={textAreaRef}
        />
      )}
      {noteType === NoteTypeEnum.CHECK &&
        checkPoints.map((checkItem, index) => (
          <NoteCheckItem
            key={checkItem.id ?? index}
            index={index}
            checkItem={checkItem}
            onHandleChange={(newCheckItem) =>
              handleChangeCheckpoint(newCheckItem, index)
            }
            onDelete={() => handleDeleteCheckpoint(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            ref={(element) => refCallback(element, index)}
          />
        ))}
    </>
  );
};

export default EditNoteBody;
