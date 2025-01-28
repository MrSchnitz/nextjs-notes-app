import { TagType } from "@/models/Tag";
import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useClickOutside from "@/lib/hooks/useClickOutside";
import AddNodeButton from "@/components/Note/EditNote/components/EditNoteButton";

const SelectTagDropdown = ({
  tags,
  noteTags,
  addTag,
}: {
  tags?: TagType[];
  noteTags?: TagType[];
  addTag: (tag: TagType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useClickOutside({
    ref: dropdownRef,
    onClickOutside: () => {
      if (isOpen) {
        console.log("CLOSE");
        // setIsOpen(false);
      }
    },
  });

  return (
    <div
      className={clsx("dropdown dropdown-bottom", isOpen && "dropdown-open")}
    >
      <AddNodeButton onClick={() => setIsOpen((prevState) => !prevState)}>
        <span className="material-icons-outlined">label</span>
      </AddNodeButton>
      <ul
        className={clsx(
          "dropdown-content menu bg-base-100 rounded-box z-20 w-52 p-2 shadow",
          !isOpen && "hidden",
        )}
        ref={dropdownRef}
      >
        {tags?.map((tag) => (
          <li key={tag.id}>
            <label className="cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(noteTags?.find((t) => t.id === tag.id))}
                className="checkbox checkbox-sm"
                onChange={() => addTag(tag)}
              />
              <span className="label-text text-base">{tag.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectTagDropdown;
