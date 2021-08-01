import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import ColorPicker, { ColorPickerProps } from "./color-picker-component";

describe("ColorPicker component", () => {
  let wrapper: ShallowWrapper;
  let mockOnChooseColor: any;

  beforeEach(() => {
    mockOnChooseColor = jest.fn();

    const mockProps: ColorPickerProps = {
      edit: false,
      onChooseColor: mockOnChooseColor,
    };

    wrapper = shallow(<ColorPicker {...mockProps} />);
  });

  it("should render ColorPicker component", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
