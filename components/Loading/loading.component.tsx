import * as React from "react";
import { CircularProgress } from "@material-ui/core";

export interface LoadingProps {
  classname?: string;
  size?: number;
}

export const Loading: React.FC<LoadingProps> = ({
  classname,
    size
}: LoadingProps) => {
  return (
    <div
      className={`w-100 d-flex justify-content-center align-items-center ${
        classname ? classname : ""
      }`}
    >
      <CircularProgress size={size ? size : 20}/>
    </div>
  );
};
