import React, { ChangeEvent } from "react";
import { CheckPointType } from "@/models/CheckPointObject";
import clsx from "clsx";

export interface NoteCardCheckItemProps {
  checkItem: CheckPointType;
  onChecked?: (checkItem: CheckPointType) => void;
}

const NoteCardCheckItem: React.FC<NoteCardCheckItemProps> = ({
  checkItem,
  onChecked,
}: NoteCardCheckItemProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newCheckItem = { ...checkItem };
    newCheckItem.checked = event.target.checked;
    onChecked?.(newCheckItem);
  };

  return (
    <div className="w-full flex items-center">
      <label className="label cursor-pointer relative">
        <input
          type="checkbox"
          checked={checkItem.checked}
          className="checkbox checkbox-xs mr-1"
          onChange={handleChange}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />
        <span
          className={clsx("label-text", checkItem.checked && "line-through")}
        >
          {checkItem.text}
        </span>
      </label>
    </div>
  );
};

export default NoteCardCheckItem;
