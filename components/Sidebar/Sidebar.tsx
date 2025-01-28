import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Tag } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import TagsModal, {
  TagsModalImperativeProps,
} from "@/components/Sidebar/TagsModal";
import {
  addNewTag,
  deleteTag,
  getAllUserTags,
  updateTag,
} from "@/repositories/TagRepository";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import { PAGE_LINKS } from "@/lib/Links";
import GhostCircleButton from "@/components/GhostCircleButton/GhostCircleButton";

export default function Sidebar() {
  const [tags, setTags] = useState<Tag[]>([]);
  const tagModalRef = useRef<TagsModalImperativeProps>(null);
  const pathname = usePathname();
  const { refresh } = useRouter();

  const { data: session } = useSession();

  const getTags = () => {
    if (session) {
      getAllUserTags(session).then((tags) => setTags(tags));
    }
  };

  const handleAddTag = async (tagName: string) => {
    if (session) {
      try {
        await addNewTag({ name: tagName }, session);
        getTags();
        refresh();
      } catch (e) {
        alert("Add tag went wrong...");
      }
    }
  };

  const handleUpdateTag = async (tagName: string, tagId: string) => {
    if (session) {
      try {
        await updateTag({ name: tagName, id: tagId }, session);
        getTags();
        refresh();
      } catch (e) {
        alert("Update tag went wrong...");
      }
    }
  };

  const handleDeleteTag = async (event: React.MouseEvent, tagId: string) => {
    event.stopPropagation();
    event.preventDefault();

    if (session) {
      try {
        await deleteTag(tagId);
        getTags();
        refresh();
      } catch (e) {
        alert("Delete tag went wrong...");
      }
    }
  };

  useEffect(() => {
    getTags();
  }, [session]);

  return (
    <>
      <TagsModal
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
        ref={tagModalRef}
      />
      <div className="mb-2 flex flex-col">
        <SidebarItem
          icon="lightbulb"
          name="Notes"
          href={PAGE_LINKS.notesPage}
          isActive={pathname === PAGE_LINKS.notesPage}
        />
        {tags.map((tag) => {
          const tagLink = `${PAGE_LINKS.tagsPage}/${tag.id}`;
          const currentLink =
            pathname === tagLink ? PAGE_LINKS.notesPage : tagLink;

          return (
            <div
              key={tag.id}
              className="flex items-center gap-x-2 w-full shrink-0 grow-0"
            >
              <SidebarItem
                className="group"
                icon="label"
                name={tag.name}
                href={currentLink}
                isActive={pathname === tagLink}
                sideItem={
                  <div className="flex items-center invisible pointer-events-none group-hover:visible group-hover:pointer-events-auto">
                    <GhostCircleButton
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault();
                        tagModalRef.current.edit(tag.name, tag.id);
                      }}
                    >
                      <span className="material-icons">edit</span>
                    </GhostCircleButton>
                    <GhostCircleButton
                      onClick={(event: React.MouseEvent) =>
                        handleDeleteTag(event, tag.id)
                      }
                    >
                      <span className="material-icons">delete</span>
                    </GhostCircleButton>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
      <SidebarItem
        icon="edit"
        name="Add tag"
        href="#"
        isActive={false}
        onClick={() => tagModalRef.current?.open()}
      />
    </>
  );
}
