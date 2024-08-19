import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import NavigationItem, { NavigationItemProps } from "./navitem.component";
import { NavItem, NavItemContent, NavItemIcon } from "./navitem.styles";

const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("NavItem component", () => {
  let wrapper: ShallowWrapper;
  let mockOnClick: any;

  beforeEach(() => {
    mockOnClick = jest.fn();

    useRouter.mockImplementationOnce(() => ({
      push: () => null,
    }));

    const mockProps: NavigationItemProps = {
      icon: null,
      isActive: false,
      isOpen: false,
      isTag: false,
      name: "",
      onClick: mockOnClick,
      url: "",
    };

    wrapper = shallow(<NavigationItem {...mockProps} />);
  });

  it("should render NavItem component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onClick when NavItem si clicked", () => {
    wrapper.find(NavItem).simulate("click");
    expect(mockOnClick).toBeCalled();
  });

  it("should render NavItemIcon, NavItemContent", () => {
    expect(wrapper.find(NavItemIcon)).toHaveLength(1);
    expect(wrapper.find(NavItemContent)).toHaveLength(1);
  });
});
