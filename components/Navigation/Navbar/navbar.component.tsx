import React, { ReactNode, useState } from "react";
import {
  NavLeft,
  NavContent,
  NavLogo,
  NavTop,
  NavUser,
  NavRight,
} from "./navbar.styles";
import { Button, IconButton } from "@material-ui/core";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import NavigationItem from "../NavItem/navitem.component";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import KeepLogo from "../../../resources/assets/keep.svg";
import MenuIcon from "@material-ui/icons/Menu";
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";

interface NavbarProps {
  children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }: NavbarProps) => {
  const [openNav, setOpenNav] = useState(true);

  const [session, loading] = useSession();


  const router = useRouter();

  const renderMenuIcon = session && (
    <IconButton
      color="inherit"
      className="ms-1"
      aria-label="open drawer"
      onClick={() => setOpenNav((prevState) => !prevState)}
      edge="start"
    >
      <MenuIcon />
    </IconButton>
  );

  const renderDrawer = session && router.pathname.includes("/notes") && (
    <NavLeft open={openNav}>
      {/*{loggedUserLoading ? (*/}
      {/*    <Loading />*/}
      {/*) : (*/}
      {/*    loggedUser?.role === UserRole.ADMIN && (*/}
      {/*        <>*/}
      {/*          <NavigationItem*/}
      {/*              name={'All notes'}*/}
      {/*              url={Links.notesPageAll}*/}
      {/*              icon={'globe'}*/}
      {/*              active={pathname.includes('notes/all')}*/}
      {/*          />*/}
      {/*          <hr />*/}
      {/*        </>*/}
      {/*    )*/}
      {/*)}*/}
      <NavigationItem
        name={"Notes"}
        url={"/notes"}
        icon={<EmojiObjectsOutlinedIcon />}
        isActive={
          router.pathname.includes("notes") && !router.pathname.includes("all")
        }
      />
      {/*<hr />*/}
      {/*{renderTags()}*/}
      {/*<NavigationItem*/}
      {/*    name={'Add tag'}*/}
      {/*    icon={'edit'}*/}
      {/*    onClick={() => handleOnTagClick()}*/}
      {/*/>*/}
    </NavLeft>
  );

  const renderUserBar = session && (
    <NavUser>
      <h6 className="m-0">
        Logged as:{" "}
        <strong>
          {/*{loggedUser && `${loggedUser.firstName} ${loggedUser.lastName}`}*/}
        </strong>
      </h6>
      <Button
        size={"small"}
        variant={"outlined"}
        onClick={() => signOut()}
        startIcon={<ExitToAppOutlinedIcon />}
      >
        Sign out
      </Button>
    </NavUser>
  );

  const renderLogo = (
    <NavLogo>
      <KeepLogo className="ms-2" />
      <h2 className="m-0 ms-2">Notes</h2>
    </NavLogo>
  );

  const renderSignIn = !session && (
    <NavUser>
      <Button
        size={"small"}
        variant={"outlined"}
        onClick={() => signIn()}
        startIcon={<PersonOutlineOutlinedIcon />}
      >
        Sign in
      </Button>
    </NavUser>
  );

  return (
    <>
      <NavTop>
        {renderMenuIcon}
        {renderLogo}
        {renderUserBar}
        {renderSignIn}
      </NavTop>
      <NavContent>
        {renderDrawer}
        <NavRight>{children}</NavRight>
      </NavContent>
      {/*{renderTagModal()}*/}
    </>
  );
};

export default Navbar;
