import { TagType } from "./Tag";
import { CheckPointType } from "./CheckPointObject";
import { Note } from "@prisma/client";

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
  tags: TagType[];
  checkPoints?: CheckPointType[];
}

export type NoteType = NoteModel;

export const NoteObject: NoteType = {
  id: "",
  name: "",
  noteType: NoteTypeEnum.TEXT,
  content: "",
  color: "#fff",
  pinned: false,
  createdAt: new Date(Date.now()).toString(),
  tags: [],
  checkPoints: [],
};

export const NoteDBObject: Note = {
  id: "",
  name: "",
  noteType: "TEXT",
  color: "",
  content: "",
  pinned: false,
  createdAt: new Date(Date.now()),
  userId: "",
};

export enum cNoteModel {
  id = "id",
  name = "name",
  noteType = "noteType",
  color = "color",
  content = "content",
  pinned = "pinned",
  createdAt = "createdAt",
  tags = "tags",
  checkPoints = "checkPoints",
}
