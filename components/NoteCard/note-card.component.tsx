import React, { useState } from "react";
import { NoteObject, NoteType, NoteTypeEnum } from "../../models/Note";
import { CheckPointType } from "../../models/CheckPointObject";
import NoteCardCheckItem from "./NoteCardCheckItem/note-card-checkitem.component";
import { TagType } from "../../models/Tag";
import { ChangeActionType } from "../../internals/helpers";
import { Dialog, Divider, IconButton } from "@material-ui/core";
import {
  NoteCardComponent,
  NoteCardContent,
  NoteCardHeader,
  NoteCardTag,
  NoteCardTags,
} from "./note-card.styles";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import AddNote from "../AddNote/add-note.component";

export interface NoteCardProps {
  note: NoteType;
  tags: TagType[];
  editNote: NoteType | null;
  onHandleChange: (action: ChangeActionType) => void;
  onAddNote: () => void;
  onDeleteNote: () => void;
  onClick?: () => void;
  onCheckItemClick?: (checkitem: CheckPointType) => void;
  onCloseModal?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  tags,
  editNote,
  onAddNote,
  onHandleChange,
  onCloseModal,
  onClick,
  onCheckItemClick,
  onDeleteNote,
}: NoteCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOnDelete = (e: any) => {
    e.stopPropagation();
    onDeleteNote();
  };

  const renderHeader = (
    <NoteCardHeader>
      <span>{note.name}</span>
      <IconButton onClick={handleOnDelete} size={"small"}>
        <DeleteOutlineOutlinedIcon />
      </IconButton>
    </NoteCardHeader>
  );

  const renderContent =
    note.noteType === NoteTypeEnum.TEXT ? (
      <NoteCardContent>{note.content}</NoteCardContent>
    ) : (
      <NoteCardContent>
        {note.checkPoints
          ?.filter((f) => !f.checked)
          .map((cp: CheckPointType, i: number) => (
            <NoteCardCheckItem
              key={i}
              checkItem={cp}
              onChecked={onCheckItemClick}
            />
          ))}
        {note.checkPoints?.find((f) => f.checked) && (
          <Divider className="bg-dark" />
        )}
        {note.checkPoints
          ?.filter((f) => f.checked)
          .map((cp: CheckPointType, i: number) => (
            <NoteCardCheckItem
              key={i}
              checkItem={cp}
              onChecked={onCheckItemClick}
            />
          ))}
      </NoteCardContent>
    );

  const renderTags = note.tags.length > 0 && (
    <>
      <Divider className="my-2 bg-dark" />
      <NoteCardTags>
        {note.tags.map((tag: TagType, k: number) => (
          <NoteCardTag key={k}>
            <LabelOutlinedIcon className="me-1" />
            <span>{tag.name}</span>
          </NoteCardTag>
        ))}
      </NoteCardTags>
    </>
  );

  const renderEditModal = (
    <Dialog
      fullWidth={true}
      open={modalOpen && !!editNote}
      classes={{
        paper: "bg-transparent",
      }}
      onClose={() => {
        setModalOpen((prevState) => !prevState);
        onCloseModal && onCloseModal();
      }}
    >
      <AddNote
        onHandleChange={onHandleChange}
        noteModel={editNote ? editNote : NoteObject}
        tags={tags}
        onAddNote={onAddNote}
        edit={true}
      />
    </Dialog>
  );

  return (
    <>
      <NoteCardComponent
        onClick={() => {
          setModalOpen(!modalOpen);
          if (onClick) {
            onClick();
          }
        }}
        color={note.color}
      >
        {renderHeader}
        {renderContent}
        {renderTags}
      </NoteCardComponent>
      {renderEditModal}
    </>
  );
};

export default NoteCard;
