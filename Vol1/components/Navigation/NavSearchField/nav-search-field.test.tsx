import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import NavSearchField, {
  NavSearchFieldProps,
} from "./nav-search-field.component";
import { TextField } from "@material-ui/core";

describe("NavSearchField component", () => {
  let wrapper: ShallowWrapper;
  let mockOnSearch: any;

  beforeEach(() => {
    mockOnSearch = jest.fn();

    const mockProps: NavSearchFieldProps = {
      value: "",
      onSearch: mockOnSearch,
    };

    wrapper = shallow(<NavSearchField {...mockProps} />);
  });

  it("should render NavSearchField component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onSearch when TextField si changed", () => {
    wrapper.find(TextField).simulate("change", { target: { value: "" } });
    expect(mockOnSearch).toBeCalled();
  });
});
