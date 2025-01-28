import React from "react";
import clsx from "clsx";

const AddNodeButton = ({
  isActive,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) => {
  return (
    <button
      type="button"
      className={clsx(
        "btn btn-sm btn-ghost btn-circle",
        isActive && "bg-gray-400",
        className,
      )}
      {...rest}
    />
  );
};

export default AddNodeButton;
