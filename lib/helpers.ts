import {NoteType} from "../models/Note";

export interface ChangeActionInterface {
  attr: string;
  value: any;
  edit?: boolean;
}

export type ChangeActionType = ChangeActionInterface;

export const changeNotesRowOrder = (noteArray: NoteType[]): NoteType[] => {
  let notes = [...noteArray]
  for (let i = 0; i < notes.length; i++) {
    notes[i].row = i;
  }
  return notes;
}
