import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import TagModalItem, { TagModalItemProps } from "./tag-modal-item.component";
import { TagObject } from "../../../models/Tag";
import { IconButton } from "@material-ui/core";

describe("TagModalItem component", () => {
  let wrapper: ShallowWrapper;
  let mockOnUpdateTag: any;
  let mockOnDeleteTag: any;

  beforeEach(() => {
    mockOnUpdateTag = jest.fn();
    mockOnDeleteTag = jest.fn();

    const mockProps: TagModalItemProps = {
      tag: TagObject,
      onUpdateTag: mockOnUpdateTag,
      onDeleteTag: mockOnDeleteTag,
    };

    wrapper = shallow(<TagModalItem {...mockProps} />);
  });

  it("should render TagModalItem component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onDelete when IconButton component is clicked", () => {
    wrapper
      .find(IconButton)
      .simulate("click", { stopPropagation: () => undefined });
    expect(mockOnDeleteTag).toHaveBeenCalled();
  });
});
