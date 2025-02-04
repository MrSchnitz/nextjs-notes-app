import React, {
    RefAttributes,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

export type TagsModalImperativeProps = {
  open: () => void;
  edit: (tagName: string, tagId: string) => void;
  close: () => void;
};

type Props = {
  onAddTag: (tagName: string) => void;
  onUpdateTag: (tagName: string, tagId: string) => void;
};

const TagsModal = ({ onAddTag, onUpdateTag, ref }: Props & RefAttributes<TagsModalImperativeProps>) => {
  const [tagId, setTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState<string>("");
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleAddOrUpdateTag = () => {
    if (newTagName.length < 3) {
      return;
    }
    if (tagId) {
      onUpdateTag(newTagName, tagId);
    } else {
      onAddTag(newTagName);
    }
    setNewTagName("");
    modalRef.current?.close();
  };

  const handleClose = () => {
    setNewTagName("");
    setTagId(null);
  };

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.showModal(),
    edit: (tagName: string, tagId: string) => {
      setNewTagName(tagName);
      setTagId(tagId);
      modalRef.current?.showModal();
    },
    close: () => modalRef.current?.close(),
  }));

  return (
    <dialog className="modal" ref={modalRef} onClose={handleClose}>
      <div className="modal-box">
        <h2 className="text-lg mb-2">{tagId ? "Update tag" : "Add new tag"}</h2>
        <input
          className="input input-sm w-full"
          onChange={(event) => setNewTagName(event.target.value)}
          onKeyDown={(event) =>
            event.code === "Enter" && handleAddOrUpdateTag()
          }
          value={newTagName}
        />
        <button
          className="btn btn-sm w-full mt-4"
          disabled={newTagName.length < 3}
          onClick={handleAddOrUpdateTag}
        >
          {tagId ? "Update tag" : "Add tag"}
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default TagsModal;
