import { TagType } from './Tag';
import { CheckPoint, CheckPointType } from './CheckPoint';
import {Note} from "@prisma/client";

export enum NoteTypeEnum {
  CHECK = 'CHECK',
  TEXT = 'TEXT',
}

export interface NoteModel {
  id?: string;
  name: string;
  noteType: NoteTypeEnum;
  content: string;
  color: string;
  pinned: boolean;
  tags: TagType[];
  checkPoints?: CheckPointType[];
}

export type NoteType = NoteModel;

export const NoteObject: NoteType = {
  id: '',
  name: '',
  noteType: NoteTypeEnum.TEXT,
  content: '',
  color: '#fff',
  pinned: false,
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
  userId: ''
};

export enum cNoteModel {
  id = 'id',
  name = 'name',
  noteType = 'noteType',
  color = 'color',
  content = 'content',
  pinned = 'pinned',
  tags = 'tags',
  checkPoints = 'checkPoints',
}
