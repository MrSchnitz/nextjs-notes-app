import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import { cTagModel, TagType } from "../../models/Tag";
import { ChangeActionType } from "../../lib/helpers";
import NavigationItem from "../Navigation/NavItem/NavItem";
import { Loading } from "../Loading/loading.component";
import TagModalItem from "./TagModalItem/tag-modal-item.component";

export interface TagsModalProps {
  newTag: TagType;
  tags: TagType[];
  tagsLoading: boolean;
  onChange: (value: ChangeActionType) => void;
  onAddTag: () => void;
  onUpdateTag: (tag: TagType) => void;
  onDeleteTag: (tag: TagType) => void;
}

const TagsModal: React.FC<TagsModalProps> = ({
  newTag,
  tags,
  tagsLoading,
  onChange,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}: TagsModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const renderModal = (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Edit tags</DialogTitle>
      <DialogContent>
        <Grid container={true} className="mb-2">
          <Grid item={true}>
            <TextField
              value={newTag.name}
              fullWidth={true}
              size={"small"}
              variant={"standard"}
              onChange={(event) =>
                onChange({ attr: cTagModel.name, value: event.target.value })
              }
              onKeyDown={(event) => event.code === "Enter" && onAddTag()}
            />
          </Grid>
          <Grid item={true}>
            <IconButton size={"small"} onClick={onAddTag}>
              <CheckOutlinedIcon />
            </IconButton>
          </Grid>
        </Grid>
        {tagsLoading ? (
          <Loading size={20} />
        ) : (
          tags &&
          tags.map((tag: TagType, k: number) => (
            <TagModalItem
              key={tag.id}
              tag={tag}
              onDeleteTag={onDeleteTag}
              onUpdateTag={onUpdateTag}
            />
          ))
        )}
      </DialogContent>
    </Dialog>
  );
  return (
    <>
      {renderModal}
      <NavigationItem
        name={"Edit tags"}
        onClick={() => setOpen((prevState) => !prevState)}
        icon={<EditOutlinedIcon />}
      />
    </>
  );
};

export default React.memo(TagsModal);
