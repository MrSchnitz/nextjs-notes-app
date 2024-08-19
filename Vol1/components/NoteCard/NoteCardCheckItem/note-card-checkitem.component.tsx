import React from "react";
import { cCheckPoint, CheckPointType } from "../../../models/CheckPointObject";
import {
  NoteCardCheckItemCheck,
  NoteCardCheckItemComponent,
  NoteCardCheckItemText,
} from "./note-card-checkitem.styles";

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
    <NoteCardCheckItemComponent>
      <NoteCardCheckItemCheck>
        <input
          type="checkbox"
          checked={checkItem.checked}
          className="checkbox checkbox-xs w-0.5 h-0.5 mr-1"
          onChange={(event) => handleChange(cCheckPoint.checked, event)}
          onClick={(event) => event.stopPropagation()}
        />
      </NoteCardCheckItemCheck>
      <NoteCardCheckItemText checked={checkItem.checked}>
        {checkItem.text}
      </NoteCardCheckItemText>
    </NoteCardCheckItemComponent>
  );
};

export default NoteCardCheckItem;
