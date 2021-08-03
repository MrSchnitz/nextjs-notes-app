import * as React from "react";
import { CircularProgress } from "@material-ui/core";
import { LoadingComponent } from "./loading.styles";

export interface LoadingProps {
  classname?: string;
  size?: number;
}

export const Loading: React.FC<LoadingProps> = ({
  classname,
  size,
}: LoadingProps) => {
  return (
    <LoadingComponent className={classname ? classname : ""}>
      <CircularProgress size={size ? size : 20} />
    </LoadingComponent>
  );
};
