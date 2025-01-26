export interface CheckPointInterface {
  id?: number | string;
  text: string | null;
  checked: boolean;
}

export type CheckPointType = CheckPointInterface;

export const CheckPointObject: CheckPointType = {
  id: 0,
  text: "",
  checked: false,
};

export enum cCheckPoint {
  id = "id",
  text = "text",
  checked = "checked",
}
