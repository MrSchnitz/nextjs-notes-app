import clsx from "clsx";
import React from "react";
import GhostCircleButton from "@/components/GhostCircleButton/GhostCircleButton";

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
      <GhostCircleButton onClick={handleClick}>
        <span
          className={clsx(
            isPinned ? "material-icons" : "material-icons-outlined",
          )}
        >
          push_pin
        </span>
      </GhostCircleButton>
    </div>
  );
};

export default EditNotePinButton;
