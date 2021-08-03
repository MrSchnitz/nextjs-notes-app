import React, { useCallback, useEffect, useRef, useState } from "react";
import { TagType } from "../../../models/Tag";
import { Grid, IconButton, TextField } from "@material-ui/core";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";

export interface TagModalItemProps {
  tag: TagType;
  onDeleteTag: (tag: TagType) => void;
  onUpdateTag: (tag: TagType) => void;
}

const TagModalItem: React.FC<TagModalItemProps> = ({
  tag,
  onDeleteTag,
  onUpdateTag,
}: TagModalItemProps) => {
  const [edit, setEdit] = useState(false);

  const [updateTag, setUpdateTag] = useState(tag);

  const tagItemRef = useRef(null);

  const clickOutsideListener = useCallback(
    (e: MouseEvent) => {
      if (
        tagItemRef.current &&
        !(tagItemRef.current as any).contains(e.target)
      ) {
        setEdit(false);
      }
    },
    [tagItemRef]
  );

  useEffect(() => {
    document.addEventListener("click", clickOutsideListener);
    return () => {
      document.removeEventListener("click", clickOutsideListener);
    };
  }, [clickOutsideListener]);

  const handleOnChange = (value: string) => {
    setUpdateTag((prevState) => {
      const newTag = Object.assign({}, prevState);
      newTag.name = value;
      return newTag;
    });
  };

  const renderItems = (
    <Grid
      container={true}
      className="py-2 cursor-pointer"
      onClick={(e) => {
        setEdit(true);
        e.stopPropagation();
      }}
    >
      <Grid item={true}>
        <LabelOutlinedIcon />
      </Grid>
      <Grid item={true} style={{ flex: 1 }}>
        <h5 className="m-0 ms-2">{tag.name}</h5>
      </Grid>
      <Grid item={true}>
        <IconButton
          size={"small"}
          onClick={(event) => {
            onDeleteTag(tag);
            event.stopPropagation();
          }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Grid>
    </Grid>
  );

  const renderEditItems = (
    <Grid container={true} className="py-2">
      <Grid item={true}>
        <IconButton size={"small"} onClick={() => onDeleteTag(tag)}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Grid>
      <Grid item={true} style={{ flex: 1 }}>
        <TextField
          value={updateTag.name}
          fullWidth={true}
          size={"small"}
          variant={"standard"}
          onChange={(event) => handleOnChange(event.target.value)}
          onKeyDown={(event) =>
            event.code === "Enter" && onUpdateTag(updateTag)
          }
        />
      </Grid>
      <Grid item={true}>
        <IconButton size={"small"} onClick={() => onUpdateTag(updateTag)}>
          <CheckOutlinedIcon />
        </IconButton>
      </Grid>
    </Grid>
  );

  return <div ref={tagItemRef}>{edit ? renderEditItems : renderItems}</div>;
};

export default TagModalItem;
