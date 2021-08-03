import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { IconButton, TextField } from "@material-ui/core";
import TagsModal, { TagsModalProps } from "./tags-modal.component";
import { TagObject } from "../../models/Tag";
import TagModalItem from "./TagModalItem/tag-modal-item.component";

describe("TagsModal component", () => {
  let wrapper: ShallowWrapper;
  let mockOnChange: any;
  let mockOnAddTag: any;
  let mockOnUpdateTag: any;
  let mockOnDeleteTag: any;

  beforeEach(() => {
    mockOnChange = jest.fn();
    mockOnAddTag = jest.fn();
    mockOnUpdateTag = jest.fn();
    mockOnDeleteTag = jest.fn();

    const mockProps: TagsModalProps = {
      newTag: TagObject,
      tags: [],
      tagsLoading: false,
      onChange: mockOnChange,
      onAddTag: mockOnAddTag,
      onUpdateTag: mockOnUpdateTag,
      onDeleteTag: mockOnDeleteTag,
    };

    wrapper = shallow(<TagsModal {...mockProps} />);
  });

  it("should render TagsModal component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onChange on TextField component", () => {
    wrapper.find(TextField).simulate("change", { target: { value: "" } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should call onAddTag when IconButton component is clicked", () => {
    wrapper.find(IconButton).simulate("click");
    expect(mockOnAddTag).toHaveBeenCalled();
  });

  it("should render TagModalItem components when tags array is not empty and tags are not loading", () => {
    const mockProps: TagsModalProps = {
      newTag: TagObject,
      tags: [TagObject, TagObject],
      tagsLoading: false,
      onChange: mockOnChange,
      onAddTag: mockOnAddTag,
      onUpdateTag: mockOnUpdateTag,
      onDeleteTag: mockOnDeleteTag,
    };

    wrapper = shallow(<TagsModal {...mockProps} />);

    const tagsItems = wrapper.find(TagModalItem);

    expect(tagsItems).toHaveLength(2);
  });
});
