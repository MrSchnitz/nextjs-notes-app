import styled from "styled-components";

const NavTop = styled.div`
  width: 100%;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(gray, 0.5);
  display: flex;
  align-items: center;
  color: #fff;

  background-color: #f5b500;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  color: #fff;

  h2 {
    margin-bottom: 0 !important;
    font-weight: bolder;
    color: #fff;
  }
  svg {
    border: 2px solid white;
    border-radius: 0.5rem;
    width: 40px;
    height: 40px;
  }
`;

const NavUser = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  text-align: right;
  margin-right: 1rem;
  h4 {
    margin: 0 !important;
  }
`;

const NavContent = styled.div`
  display: flex;
`;

interface NavLeftInterface {
    open: boolean;
}

const NavLeft = styled.div<NavLeftInterface>`
  width: ${(props) => (props.open ? "200px" : "50px")};
  height: calc(100vh - 50px);
  padding-right: 0.1rem;
  overflow: hidden;
  
  transition: 1s all;
`;

NavLeft.displayName = "NavLeft";

const NavRight = styled.div`
  flex: 1;
  background-color: #0070f3;
`;

export { NavTop, NavLogo, NavUser, NavLeft, NavContent, NavRight };
