import { ImageType } from "./ImageInput";
import React from "react";
import clsx from "clsx";

type Props = {
  imageData: string;
  className?: string;
  onRemove: () => void;
};

export const ImageInputViewer = ({ imageData, className, onRemove }: Props) => {
  return (
    <div
      className={clsx("relative flex flex-col items-end overflow-hidden", className)}
    >
      <button
        className="btn btn-sm btn-circle absolute bottom-[10px] right-[10px] transition-transform hover:scale-105"
        title="Zavrit"
        onClick={onRemove}
      >
        <span className="material-icons">delete</span>
      </button>
      <div className="w-full">
        <img className="object-cover object-center" src={imageData} alt="" />
      </div>
    </div>
  );
};
