import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  addNewTag,
  deleteTag,
  getAllUserTags,
} from "@/repositories/TagRepository";
import { Tag } from "@prisma/client";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import { PAGE_LINKS } from "@/lib/Links";
import clsx from "clsx";

export default function TagsModal() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);
  const { refresh } = useRouter();
  const pathname = usePathname()

  const { data: session } = useSession();

  const getTags = () => {
    if (session) {
      getAllUserTags(session).then((tags) => setTags(tags));
    }
  };

  const handleAddTag = async () => {
    if (session && tagName.length >= 3) {
      try {
        await addNewTag({ name: tagName }, session);
        getTags();
        modalRef.current?.close();
        setTagName("");
        refresh();
      } catch (e) {
        alert("Add tag went wrong...");
      }
    }
  };

  const handleDeleteTag = async (tagId: string) => {
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
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box">
          <input
            className="input input-sm w-full"
            onChange={(event) => setTagName(event.target.value)}
            onKeyDown={(event) => event.code === "Enter" && handleAddTag()}
          />
          <button
            className="btn btn-sm w-full mt-4"
            disabled={tagName.length < 3}
            onClick={handleAddTag}
          >
            Add tag
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="mb-4 flex flex-col gap-y-2">
        {tags.map((tag) => {
          const tagLink = `${PAGE_LINKS.tagsPage}/${tag.id}`
          const currentLink = pathname === tagLink ? PAGE_LINKS.notesPage : tagLink

          return <div
              key={tag.id}
              className="flex items-center gap-x-2 w-full shrink-0 grow-0"
          >
            <Link
                href={currentLink}
                className={clsx("btn btn-sm flex-1", pathname !== tagLink && "btn-outline")}
            >
              {tag.name}
            </Link>
            <button
                className="btn btn-sm"
                onClick={() => handleDeleteTag(tag.id)}
            >
              Delete
            </button>
          </div>
        })}
      </div>
      <button
        className="btn btn-sm"
        onClick={() => modalRef.current?.showModal()}
      >
        Add tag
      </button>
    </>
  );
}
