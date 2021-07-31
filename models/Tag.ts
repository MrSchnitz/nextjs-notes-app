export interface TagModel {
  id: string;
  name: string;
}

export type TagType = TagModel;

export const cTagModel = {
  id: "id",
  name: "name",
};

export const TagObject: TagType = {
  id: "",
  name: "",
};

export function isTagType(object: any): object is TagType {
  return "name" in object;
}
