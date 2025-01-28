import React, { forwardRef, useState } from "react";
import { cCheckPoint, CheckPointType } from "@/models/CheckPointObject";
import clsx from "clsx";

export interface NoteCheckItemProps {
  index: number;
  checkItem: CheckPointType;
  onHandleChange: (checkItem: CheckPointType) => void;
  onDelete: (id: number) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const NoteCheckItem = forwardRef<HTMLInputElement, NoteCheckItemProps>(
  ({ index, checkItem, onHandleChange, onDelete, onKeyDown }, ref) => {
    const [focused, setFocused] = useState<boolean>(false);

    const handleChange = (attr: string, val: any) => {
      const newCheckItem: any = { ...checkItem };
      newCheckItem[attr] = val;
      onHandleChange(newCheckItem);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "Backspace":
          if (checkItem.text !== null && checkItem.text === "") {
            onDelete(checkItem.id as number);
          }
          break;
      }
      onKeyDown?.(event);
    };

    return (
      <div
        className={clsx(
          "flex items-center group -ml-4 px-4 w-[calc(100%+2rem)]",
          focused && "border-t border-b",
        )}
      >
        <label className="label cursor-pointer">
          {checkItem.text === null ? (
            <span className="material-icons-outlined">add</span>
          ) : (
            <input
              type="checkbox"
              defaultChecked={checkItem.checked}
              className="checkbox"
              onChange={(e) =>
                handleChange(cCheckPoint.checked, e.target.checked)
              }
              onClick={(event) => event.stopPropagation()}
            />
          )}
        </label>
        <div className="flex items-center flex-1 ml-2">
          <input
            className={clsx(
              "w-full flex-1",
              checkItem.checked && "line-through",
            )}
            placeholder={"Write something..."}
            value={checkItem.text ?? ""}
            onChange={(event) =>
              handleChange(cCheckPoint.text, event.target.value)
            }
            autoFocus={index === 0}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            ref={ref}
          />
          {checkItem.text !== null && (
            <button
              className="btn btn-sm btn-ghost btn-circle hidden group-hover:block"
              onClick={(event) => {
                onDelete(checkItem.id as number);
                event.stopPropagation();
              }}
            >
              <span className="material-icons-outlined">clear</span>
            </button>
          )}
        </div>
      </div>
    );
  },
);

export default NoteCheckItem;
