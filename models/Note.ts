import { TagType } from "./Tag";
import { CheckPointType } from "./CheckPointObject";

export enum NoteTypeEnum {
  CHECK = "CHECK",
  TEXT = "TEXT",
}

export interface NoteModel {
  id?: string;
  name: string;
  noteType: NoteTypeEnum;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  image?: string;
  tags?: TagType[];
  checkPoints?: CheckPointType[];
}

export type NoteError = {
  message: string;
}

export type NoteType = NoteModel;

export const EMPTY_NOTE: NoteType = {
  name: "",
  content: "",
  noteType: NoteTypeEnum.TEXT,
  checkPoints: [],
  tags: [],
  color: "",
  pinned: false,
  createdAt: "",
  image: undefined,
};