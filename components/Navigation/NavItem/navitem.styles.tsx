import styled from "styled-components";

interface NavItemInterface {
    active: boolean;
}

const NavItem = styled.div<NavItemInterface>`
  display: flex;
  align-items: center;
  border-radius: 0 1.5rem 1.5rem 0;
  border: 1px solid rgba(245,181,0,0.50);
  padding: 0.3rem;
  margin: 1rem 0;
  cursor: pointer;
  
  background-color: ${(props) => (props.active ? 'rgba(245,181,0,0.50)' : 'transparent')};

  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(245,181,0,0.50);
  }
`;

NavItem.displayName = "NavItem";

const NavItemIcon = styled.div`
  margin-right: 1rem;
  margin-left: 0.5rem;
`;

const NavItemContent = styled.div`
  vertical-align: center;
  // flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 1.3rem;
`;

export { NavItem, NavItemContent, NavItemIcon };
