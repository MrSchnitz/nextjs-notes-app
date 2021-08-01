export interface TagModel {
  id: string;
  name: string;
  createdAt: Date;
}

export type TagType = TagModel;

export const cTagModel = {
  id: "id",
  name: "name",
  createdAt: "createdAt",
};

export const TagObject: TagType = {
  id: "",
  name: "",
  createdAt: new Date(Date.now()),
};

export function isTagType(object: any): object is TagType {
  return "name" in object;
}
