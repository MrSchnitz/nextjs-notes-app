import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { CheckPointObject } from "../../../models/CheckPointObject";
import { Checkbox } from "@material-ui/core";
import NoteCardCheckItem, {
  NoteCardCheckItemProps,
} from "./note-card-checkitem.component";
import { NoteCardCheckItemText } from "./note-card-checkitem.styles";

describe("NoteCardCheckItem component", () => {
  let wrapper: ShallowWrapper;
  let mockOnChecked: any;
  const checkPoint = CheckPointObject;
  checkPoint.checked = true;
  checkPoint.text = "text";

  beforeEach(() => {
    mockOnChecked = jest.fn();

    const mockProps: NoteCardCheckItemProps = {
      checkItem: checkPoint,
      onChecked: mockOnChecked,
    };

    wrapper = shallow(<NoteCardCheckItem {...mockProps} />);
  });

  it("should render NoteCardCheckItem component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onChecked when Checkbox component is clicked", () => {
    wrapper.find(Checkbox).simulate("change", { target: { checked: true } });
    expect(mockOnChecked).toHaveBeenCalled();
  });

  it("should render when NoteCardCheckItemText component with checkItem values", () => {
    const checkItem = wrapper.find(NoteCardCheckItemText);
    expect(checkItem).toHaveLength(1);
    expect(checkItem.prop("checked")).toBe(checkPoint.checked);
    expect(checkItem.contains(checkPoint.text)).toEqual(true);
  });
});
