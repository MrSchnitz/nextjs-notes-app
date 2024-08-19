import React from "react";
import { cCheckPoint, CheckPointType } from "@/models/CheckPointObject";
import clsx from "clsx";

export interface NoteCardCheckItemProps {
  checkItem: CheckPointType;
  onChecked?: (checkItem: CheckPointType) => void;
}

const NoteCardCheckItem: React.FC<NoteCardCheckItemProps> = ({
  checkItem,
  onChecked,
}: NoteCardCheckItemProps) => {
  const handleChange = (attr: string, event: any) => {
    const newCheckItem: any = { ...checkItem };

    newCheckItem[attr] = event.target.checked;

    onChecked && onChecked(newCheckItem);
  };

  return (
    <div className="w-full flex items-center">
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          checked={checkItem.checked}
          className="checkbox checkbox-xs mr-1"
          onChange={(event) => handleChange(cCheckPoint.checked, event)}
          onClick={(event) => event.stopPropagation()}
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
