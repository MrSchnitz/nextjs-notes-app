import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  addNewTag,
  deleteTag,
  getAllUserTags,
} from "@/repositories/TagRepository";
import { Tag } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_LINKS } from "@/lib/Links";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import TagsModal, {
  TagsModalImperativeProps,
} from "@/components/Sidebar/TagsModal";

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
      <TagsModal onAddTag={handleAddTag} ref={tagModalRef} />
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
                  <button
                    className="btn btn-sm btn-circle btn-ghost hidden group-hover:block"
                    onClick={(event) => handleDeleteTag(event, tag.id)}
                  >
                    <span className="material-icons">delete</span>
                  </button>
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
