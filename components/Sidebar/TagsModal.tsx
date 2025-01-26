import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type TagsModalImperativeProps = {
  open: () => void;
  close: () => void;
};

type Props = {
  onAddTag: (tagName: string) => void;
};

const TagsModal = forwardRef<TagsModalImperativeProps, Props>(
  ({ onAddTag }: Props, ref) => {
    const [tagName, setTagName] = useState("");
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleAddTag = () => {
      if (tagName.length < 3) {
        return;
      }
      onAddTag(tagName);
      setTagName("");
      modalRef.current?.close();
    };

    const handleClose = () => {
      setTagName("");
    };

    useImperativeHandle(ref, () => ({
      open: () => modalRef.current?.showModal(),
      close: () => modalRef.current?.close(),
    }));

    return (
      <dialog className="modal" ref={modalRef} onClose={handleClose}>
        <div className="modal-box">
          <h2 className="text-lg mb-2">Add new tag</h2>
          <input
            className="input input-sm w-full"
            onChange={(event) => setTagName(event.target.value)}
            onKeyDown={(event) => event.code === "Enter" && handleAddTag()}
            value={tagName}
          />
          <button
            className="btn btn-sm w-full mt-4"
            disabled={tagName.length < 3}
            onClick={handleAddTag}
          >
            Add tag
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  },
);

export default TagsModal;
