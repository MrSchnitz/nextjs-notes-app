import styled from "styled-components";

interface NavItemInterface {
  active: boolean;
  open: boolean;
  isTag?: boolean;
}

const NavItem = styled.div<NavItemInterface>`
  display: flex;
  align-items: center;
  border-radius: ${(props) => (props.open ? "0 1.5rem 1.5rem 0" : "1.5rem")};
  border: 1px solid rgba(245, 181, 0, 0.5);
  padding: ${(props) => (props.isTag ? "0.1rem 0" : "0.3rem")};
  margin: ${(props) => (props.isTag ? "0.2rem 0" : "0.5rem 0")};
  cursor: pointer;

  background-color: ${(props) =>
    props.active ? "rgba(245,181,0,0.50)" : "transparent"};

  transition: all 0.3s;

  &:hover {
    background-color: rgba(245, 181, 0, 0.5);
  }
`;

NavItem.displayName = "NavItem";

const NavItemIcon = styled.div`
  margin-right: 1rem;
  margin-left: 0.5rem;
`;

interface NavItemContentInterface {
  isTag: boolean;
}

const NavItemContent = styled.div<NavItemContentInterface>`
  // flex: 1;
  text-align: center;
  font-weight: ${(props) => (props.isTag ? "normal" : "bold")};
  font-size: 1rem;
  white-space: nowrap;
`;

export { NavItem, NavItemContent, NavItemIcon };
