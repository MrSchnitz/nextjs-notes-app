"use client";
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
import keepLogo from "../../../resources/assets/keep.svg";
import MenuIcon from "@material-ui/icons/Menu";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { ChangeActionType } from "../../../lib/helpers";
import { Loading } from "../../Loading/loading.component";
import { PageLinks } from "../../../lib/Links";
import { device } from "../../../resources/styles/utils/media-query-utils";
import NavSearchField from "../NavSearchField/nav-search-field.component";
import {
  NotesAPI,
  selectSearchNotesQuery,
} from "../../../API/NotesPageAPI/NotesAPI";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export interface NavbarProps {
  children: ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  const matchesMobileL = useMediaQuery(device.mobileL);

  const [openNav, setOpenNav] = useState(!matchesMobileL);

  const { data: session } = useSession();

  const dispatch = useDispatch();

  const router = useRouter();
  const query = useSearchParams();
  const pathname = usePathname();

  const tagsLoading: boolean = useSelector(selectTagsLoading);
  const tags: TagType[] = useSelector(selectTags);
  const newTag: TagType = useSelector(selectNewTag);
  const searchNotesQuery = useSelector(selectSearchNotesQuery);

  const handleOnNavClick = () => {
    dispatch(NotesAPI.reset());
  };

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
      <NavigationItem
        key={tag.id}
        name={tag.name}
        icon={<LabelOutlinedIcon />}
        url={`${PageLinks.tagsPage}/${tag.id}`}
        isTag={true}
        isActive={query.get("tagId") === tag.id}
        onClick={handleOnNavClick}
      />
    ))
  );

  const renderDrawer = session &&
    (pathname.includes("/notes") || pathname.includes("/tags")) && (
      <NavLeft open={openNav}>
        <NavigationItem
          name={"Notes"}
          url={PageLinks.notesPage}
          icon={<EmojiObjectsOutlinedIcon />}
          isActive={pathname.includes("notes") && !pathname.includes("all")}
          isOpen={openNav}
          onClick={handleOnNavClick}
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
            router.refresh();
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
        <Image src={keepLogo} alt="logo" height={40} width={40} className="m-2" />
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

  const renderSearchField = session && (
    <NavSearchField
      onSearch={(queryString: string) =>
        dispatch(
          NotesAPI.searchNotes({
            query: queryString,
            tagId: query.get("tagId") ?? undefined,
          }),
        )
      }
      value={searchNotesQuery}
    />
  );

  return (
    <>
      <NavTop>
        {renderMenuIcon}
        {renderLogo}
        {renderSearchField}
        {renderUserBar}
        {renderSignIn}
      </NavTop>
      <NavContent>
        {renderDrawer}
        <NavRight>{children}</NavRight>
      </NavContent>
    </>
  );
}
