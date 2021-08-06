import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChangeActionType } from "../../lib/helpers";
import {
  AddNoteInput,
  AddNoteInputAddCheckPoint,
  AddNoteInputCheckPoints,
  AddNoteInputContent,
  AddNoteInputContentSwitch,
  AddNoteInputContentWrapper,
  AddNoteInputErrorMessage,
  AddNoteInputMenu,
  AddNoteInputNameInput,
  AddNoteInputTag,
  AddNoteInputTags,
} from "./add-note.styles";
import { Button, Divider, IconButton } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { SubmitHandler, useForm } from "react-hook-form";
import ColorPicker from "../ColorPicker/color-picker-component";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import TextFieldsOutlinedIcon from "@material-ui/icons/TextFieldsOutlined";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import NoteCheckItem from "./AddNoteCheckItem/add-note-checkitem.component";
import { cNoteModel, NoteType, NoteTypeEnum } from "../../models/Note";
import {
  CheckPointObject,
  CheckPointType,
} from "../../models/CheckPointObject";
import { TagType } from "../../models/Tag";

export interface AddNoteProps {
  onHandleChange: (action: ChangeActionType) => void;
  noteModel: NoteType;
  tags: TagType[];
  onAddNote: () => void;
  onClick?: () => void;
  edit?: boolean;
}

const AddNote: React.FC<AddNoteProps> = ({
  onHandleChange,
  noteModel,
  onAddNote,
  tags,
  edit,
  onClick,
}: AddNoteProps) => {
  const [focused, setFocused] = useState<boolean>(!!edit);

  const mainRef = useRef(null);

  const clickOutsideListener = useCallback((e: MouseEvent) => {
    if (!(mainRef.current! as any).contains(e.target)) {
      setFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", clickOutsideListener);
    return () => {
      document.removeEventListener("click", clickOutsideListener);
    };
  }, [clickOutsideListener]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteType>();

  const onSubmit: SubmitHandler<NoteType> = (data) => onAddNote();

  const handleChangeNoteType = (e: any, noteType: NoteTypeEnum) => {
    onHandleChange({
      attr: cNoteModel.noteType,
      value: noteType,
    });
    e.stopPropagation();
  };

  const renderBottomMenu = (
    <AddNoteInputMenu>
      <AddNoteInputTags>
        {tags &&
          tags.map((tag: TagType, k: number) => (
            <AddNoteInputTag
              key={tag.id}
              chosen={!!noteModel.tags.find((t) => t.id === tag.id)}
              onClick={() =>
                onHandleChange({ attr: cNoteModel.tags, value: tag })
              }
            >
              <LabelOutlinedIcon fontSize={"small"} className="me-1" />
              <span>{tag.name}</span>
            </AddNoteInputTag>
          ))}
      </AddNoteInputTags>
      <AddNoteInputContentSwitch>
        <ColorPicker
          onChooseColor={(color) =>
            onHandleChange({ attr: cNoteModel.color, value: color })
          }
          edit={edit}
        />
      </AddNoteInputContentSwitch>
      <AddNoteInputContentSwitch>
        {noteModel.noteType === NoteTypeEnum.TEXT ? (
          <IconButton
            size={"small"}
            onClick={(event) => handleChangeNoteType(event, NoteTypeEnum.CHECK)}
          >
            <ListOutlinedIcon />
          </IconButton>
        ) : (
          <IconButton
            size={"small"}
            onClick={(event) => handleChangeNoteType(event, NoteTypeEnum.TEXT)}
          >
            <TextFieldsOutlinedIcon />
          </IconButton>
        )}
      </AddNoteInputContentSwitch>
    </AddNoteInputMenu>
  );

  const renderNameInput = (
    <>
      <AddNoteInputNameInput
        placeholder={focused ? "Name" : "Take a note..."}
        {...register(cNoteModel.name, { required: true, maxLength: 20 })}
        onChange={(event) =>
          onHandleChange({ attr: cNoteModel.name, value: event.target.value })
        }
        value={noteModel.name}
      />
      {errors.name?.type === "required" && (
        <AddNoteInputErrorMessage style={{ bottom: 0 }}>
          Name is required
        </AddNoteInputErrorMessage>
      )}
    </>
  );

  const renderTextContentInput = (
    <>
      <AddNoteInputContent
        {...register(cNoteModel.content, { maxLength: 1000 })}
        onFocus={() => setFocused(true)}
        rows={edit ? 8 : 4}
        onChange={(event) =>
          onHandleChange({
            attr: cNoteModel.content,
            value: event.target.value,
          })
        }
        placeholder={"Write something"}
        value={noteModel.content}
      />
      {errors.content?.type === "required" && (
        <AddNoteInputErrorMessage>Too long</AddNoteInputErrorMessage>
      )}
    </>
  );

  const renderCheckPointsContentInput = (
    <>
      <AddNoteInputCheckPoints edit={!!edit}>
        {noteModel.checkPoints
          ?.filter((f) => !f.checked)
          .map((c: CheckPointType, i: number) => (
            <NoteCheckItem
              key={c.id}
              checkItem={c}
              onHandleChange={(newCheckItem) =>
                onHandleChange({
                  attr: cNoteModel.checkPoints,
                  value: newCheckItem,
                })
              }
              onDelete={(id) =>
                onHandleChange({
                  attr: cNoteModel.checkPoints,
                  value: id,
                })
              }
            />
          ))}
        {noteModel.checkPoints?.find((f) => f.checked) && (
          <Divider className="w-100 bg-dark mt-3 mb-2" />
        )}
        {noteModel.checkPoints
          ?.filter((f) => f.checked)
          .map((c: CheckPointType, i: number) => (
            <NoteCheckItem
              key={c.id}
              checkItem={c}
              onHandleChange={(newCheckItem) =>
                onHandleChange({
                  attr: cNoteModel.checkPoints,
                  value: newCheckItem,
                })
              }
              onDelete={(id) =>
                onHandleChange({
                  attr: cNoteModel.checkPoints,
                  value: id,
                })
              }
            />
          ))}
      </AddNoteInputCheckPoints>
      <AddNoteInputAddCheckPoint>
        <IconButton
          size={"small"}
          onClick={() =>
            onHandleChange({
              attr: cNoteModel.checkPoints,
              value: CheckPointObject,
            })
          }
        >
          <AddOutlinedIcon />
        </IconButton>
      </AddNoteInputAddCheckPoint>
    </>
  );

  return (
    <AddNoteInput
      edit={edit}
      open={focused}
      checkpoints={noteModel.checkPoints?.length}
      type={noteModel.noteType}
      onFocus={() => setFocused(true)}
      onClick={onClick}
      style={{ backgroundColor: noteModel.color }}
      ref={mainRef}
      onKeyDown={(event) =>
        event.code === "Enter" &&
        noteModel.noteType === NoteTypeEnum.CHECK &&
        onHandleChange({
          attr: cNoteModel.checkPoints,
          value: CheckPointObject,
        })
      }
    >
      {renderNameInput}
      {(focused || (edit !== undefined && edit)) && (
        <AddNoteInputContentWrapper
          initial={{ opacity: 0, width: "100%" }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {noteModel.noteType === NoteTypeEnum.TEXT
            ? renderTextContentInput
            : renderCheckPointsContentInput}
          {renderBottomMenu}
          <Button
            id={"add-button"}
            fullWidth={true}
            size={"small"}
            variant={"outlined"}
            onClick={handleSubmit(onSubmit)}
            className="mt-2"
            disabled={noteModel.name.length === 0}
          >
            {edit ? "Update" : "Add"}
          </Button>
        </AddNoteInputContentWrapper>
      )}
    </AddNoteInput>
  );
};

export default React.memo(AddNote);
