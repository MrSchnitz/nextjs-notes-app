import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { Loading, LoadingProps } from "./loading.component";
import { CircularProgress } from "@material-ui/core";

describe("Loading component", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const mockProps: LoadingProps = {
      size: 10,
      classname: "",
    };

    wrapper = shallow(<Loading {...mockProps} />);
  });

  it("should render Loading component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render CircularProgress component with correct size prop", () => {
    const circularProgress = wrapper.find(CircularProgress);
    expect(circularProgress).toHaveLength(1);
    expect(circularProgress.prop("size")).toBe(10);
  });
});
