import clsx from "clsx";
import React from "react";
import AddNodeButton from "@/components/EditNote/components/EditNoteButton";

type Props = {
  className?: string;
  isPinned: boolean;
  onPinChange: (isPinned: boolean) => void;
};

const EditNotePinButton = ({ className, isPinned, onPinChange }: Props) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onPinChange(!isPinned);
  };

  return (
    <div className={className}>
      <AddNodeButton onClick={handleClick}>
        <span
          className={clsx(
            isPinned ? "material-icons" : "material-icons-outlined",
          )}
        >
          push_pin
        </span>
      </AddNodeButton>
    </div>
  );
};

export default EditNotePinButton;
