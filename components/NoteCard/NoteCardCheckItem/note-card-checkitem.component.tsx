import React from "react";
import { cCheckPoint, CheckPointType } from "../../../models/CheckPoint";
import { Checkbox } from "@material-ui/core";
import {
  NoteCardCheckItemCheck,
  NoteCardCheckItemComponent,
  NoteCardCheckItemText,
} from "./note-card-checkitem.styles";

export interface NoteCardCheckItemProps {
  checkItem: CheckPointType;
  onChecked?: (checkitem: CheckPointType) => void;
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
        <Checkbox
          size={"small"}
          color={"default"}
          checked={checkItem.checked}
          className="p-1"
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
