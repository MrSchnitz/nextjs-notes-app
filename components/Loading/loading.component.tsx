import * as React from "react";
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
      Loading...
    </LoadingComponent>
  );
};
