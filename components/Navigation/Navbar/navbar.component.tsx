import React, { ReactNode, useEffect, useState } from "react";
import {
  NavContent,
  NavLeft,
  NavLogo,
  NavRight,
  NavTop,
  NavUser,
  NavUserImage,
} from "./navbar.styles";
import { Button, IconButton, useMediaQuery } from "@material-ui/core";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import NavigationItem from "../NavItem/navitem.component";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import KeepLogo from "../../../resources/assets/keep.svg";
import MenuIcon from "@material-ui/icons/Menu";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  selectNewTag,
  selectTags,
  selectTagsLoading,
  TagsAPI,
} from "../../../API/TagsAPI/TagsAPI";
import { useDispatch, useSelector } from "react-redux";
import { TagType } from "../../../models/Tag";
import TagsModal from "../../TagsModal/tags-modal.component";
import Link from "next/link";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import { ChangeActionType } from "../../../utils/helpers";
import { Loading } from "../../Loading/loading.component";
import useRouterRefresh from "../../../hooks/useRouterRefresh";
import { PageLinks } from "../../../utils/Links";
import { device } from "../../../resources/styles/utils/media-query-utils";
import NavSearchField from "../NavSearchField/nav-search-field.component";
import {
  NotesAPI,
  selectSearchNotesQuery,
} from "../../../API/NotesPageAPI/NotesAPI";

export interface NavbarProps {
  children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }: NavbarProps) => {
  const matchesMobileL = useMediaQuery(device.mobileL);

  const [openNav, setOpenNav] = useState(!matchesMobileL);

  const [session, loading] = useSession();

  const dispatch = useDispatch();

  const refresh = useRouterRefresh();

  const router = useRouter();

  const tagsLoading: boolean = useSelector(selectTagsLoading);

  const tags: TagType[] = useSelector(selectTags);

  const newTag: TagType = useSelector(selectNewTag);

  const searchNotesQuery = useSelector(selectSearchNotesQuery);

  useEffect(() => {
    dispatch(TagsAPI.fetchTags());
  }, [dispatch, session]);

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

  const renderTagLinks = tagsLoading ? (
    <Loading size={25} />
  ) : (
    tags &&
    tags.map((tag: TagType, index: number) => (
      <Link href={`${PageLinks.tagsPage}/${tag.id}`} key={tag.id}>
        <NavigationItem
          name={tag.name}
          icon={<LabelOutlinedIcon />}
          isTag={true}
          isActive={router.query.tagId === tag.id}
        />
      </Link>
    ))
  );

  const renderDrawer = session &&
    (router.pathname.includes("/notes") ||
      router.pathname.includes("/tags")) && (
      <NavLeft open={openNav}>
        <NavigationItem
          name={"Notes"}
          url={PageLinks.notesPage}
          icon={<EmojiObjectsOutlinedIcon />}
          isActive={
            router.pathname.includes("notes") &&
            !router.pathname.includes("all")
          }
          isOpen={openNav}
        />
        {renderTagLinks}
        <TagsModal
          newTag={newTag}
          tags={tags}
          tagsLoading={tagsLoading}
          onChange={(value: ChangeActionType) =>
            dispatch(TagsAPI.handleChange(value))
          }
          onAddTag={() => dispatch(TagsAPI.addTag())}
          onUpdateTag={(tag: TagType) => dispatch(TagsAPI.updateTag(tag))}
          onDeleteTag={(tag: TagType) => {
            dispatch(TagsAPI.deleteTag(tag));
            refresh();
          }}
        />
      </NavLeft>
    );

  const renderUserBar = session && (
    <NavUser>
      <NavUserImage imageUrl={session?.user?.image}></NavUserImage>
      <h6 className="m-0 ms-2 me-3">
        <strong>{session?.user?.name}</strong>
      </h6>
      {matchesMobileL ? (
        <IconButton size={"small"} onClick={() => signOut()}>
          <ExitToAppOutlinedIcon />
        </IconButton>
      ) : (
        <Button
          size={"small"}
          variant={"outlined"}
          onClick={() => signOut()}
          startIcon={<ExitToAppOutlinedIcon />}
        >
          Sign out
        </Button>
      )}
    </NavUser>
  );

  const renderLogo = (
    <Link href={PageLinks.landingPage}>
      <NavLogo>
        <KeepLogo className="ms-2" />
        <h2 className="m-0 ms-2">Notes</h2>
      </NavLogo>
    </Link>
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
        <NavSearchField
          onSearch={(query: string) =>
            dispatch(
              NotesAPI.searchNotes({
                query: query,
                tagId: router.query.tagId
                  ? (router.query.tagId as string)
                  : undefined,
              })
            )
          }
          value={searchNotesQuery}
        />
        {renderUserBar}
        {renderSignIn}
      </NavTop>
      <NavContent>
        {renderDrawer}
        <NavRight>{children}</NavRight>
      </NavContent>
    </>
  );
};

export default Navbar;
