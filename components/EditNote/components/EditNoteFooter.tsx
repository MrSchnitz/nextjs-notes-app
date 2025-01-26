import { TagType } from "@/models/Tag";
import React, { PropsWithChildren } from "react";
import AnimatedHeight from "@/components/AnimatedHeight/AnimatedHeight";
import { ADD_NOTE_TRANSITION_DURATION } from "@/components/EditNote/EditNote";

type Props = {
  tags: TagType[];
  isTransitionDisabled?: boolean;
};

const EditNoteFooter = ({
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
        <div className="flex items-center gap-x-2 mb-2 min-h-[20px]">
          {tags.map((tag) => (
            <div className="badge badge-neutral">{tag.name}</div>
          ))}
        </div>
      </AnimatedHeight>
      <div className="flex items-center gap-x-2">{children}</div>
    </>
  );
};

export default EditNoteFooter;
