import { TagType } from "@/models/Tag";
import React, { PropsWithChildren } from "react";
import AnimatedHeight from "@/components/AnimatedHeight/AnimatedHeight";
import { ADD_NOTE_TRANSITION_DURATION } from "@/components/Note/EditNote/EditNote";
import clsx from "clsx";

type Props = {
  className?: string;
  tags: TagType[];
  isTransitionDisabled?: boolean;
};

const EditNoteFooter = ({
  className,
  children,
  tags,
  isTransitionDisabled,
}: PropsWithChildren<Props>) => {
  return (
    <>
      <AnimatedHeight
        duration={ADD_NOTE_TRANSITION_DURATION}
        toggle={tags.length !== 0}
        disabled={isTransitionDisabled}
      >
        <div
          className={clsx(
            "flex items-center gap-x-2 mb-2 min-h-[20px]",
            className,
          )}
        >
          {tags.map((tag) => (
            <div key={tag.id} className="badge badge-neutral">
              {tag.name}
            </div>
          ))}
        </div>
      </AnimatedHeight>
      <div className="flex items-center gap-x-2">{children}</div>
    </>
  );
};

export default EditNoteFooter;
