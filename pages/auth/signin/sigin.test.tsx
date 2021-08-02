import React from "react";
import {shallow, ShallowWrapper} from "enzyme";
import SignInPage, {SignInProps} from "./index";

describe("SignIn page", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const mockProps: SignInProps = {
      providers: null,
    };

    wrapper = shallow(<SignInPage {...mockProps} />);
  });

  it("should render SignIn page", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
