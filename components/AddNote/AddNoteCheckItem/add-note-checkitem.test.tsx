import React from "react";
import {shallow, ShallowWrapper,} from "enzyme";
import NoteCheckItem, {NoteCheckItemProps,} from "./add-note-checkitem.component";
import {CheckPoint} from "../../../models/CheckPoint";
import {Checkbox, IconButton, TextField} from "@material-ui/core";

describe("AddNoteCheckItem component", () => {
  let wrapper: ShallowWrapper;
  let mockOnDelete: any;
  let mockOnHandleChange: any;

  beforeEach(() => {
    mockOnDelete = jest.fn();
    mockOnHandleChange = jest.fn();

    const mockProps: NoteCheckItemProps = {
      checkItem: CheckPoint,
      onDelete: mockOnDelete,
      onHandleChange: mockOnHandleChange,
    };

    wrapper = shallow(<NoteCheckItem {...mockProps} />);
  });

  it("should render AddNoteCheckItem component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onHandleChange when Checkbox component is clicked", () => {
    wrapper.find(Checkbox).simulate("change", { target: { checked: true } });

    expect(mockOnHandleChange).toHaveBeenCalled();
  });

  it("should call onHandleChange when TextField component is clicked", () => {
    wrapper.find(TextField).simulate("change", { target: { value: "" } });

    expect(mockOnHandleChange).toHaveBeenCalled();
  });

  it("should call onDelete when IconButton component is clicked", () => {
    wrapper
      .find(IconButton)
      .simulate("click", { stopPropagation: () => undefined });

    expect(mockOnDelete).toHaveBeenCalled();
  });
});
