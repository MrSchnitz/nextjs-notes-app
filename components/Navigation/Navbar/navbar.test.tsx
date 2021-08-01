import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import Navbar, { NavbarProps } from "./navbar.component";
import { NavContent, NavRight, NavTop, NavUser } from "./navbar.styles";
import * as redux from "react-redux";
import { initializeStore } from "../../../store/configureStore";
import { Provider } from "react-redux";

describe("Navbar component", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const store = initializeStore();

    const mockProps: NavbarProps = {
      children: <div />,
    };

    wrapper = shallow(
      <Provider store={store}>
        <Navbar {...mockProps} />
      </Provider>
    );
  });

  it("should render Navbar component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render children component", () => {
    expect(wrapper.containsMatchingElement(<div />)).toEqual(true);
  });
});
