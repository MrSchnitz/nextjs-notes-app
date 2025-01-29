"use server";
import { Tag } from "@prisma/client";
import { Session } from "next-auth";
import { TagType } from "@/models/Tag";
import prisma from "../lib/prisma";

/**
 * Get all tags of current signed user
 * @param userSession - session object of current user
 */
export const getAllUserTags = async (userSession: Session): Promise<Tag[]> => {
  const user = await prisma.user.findFirst({
    where: { name: userSession?.user?.name },
    include: {
      tags: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (user) {
    return user.tags;
  } else {
    return [];
  }
};

/**
 * Add new tag for current logged user
 * @param tag - tag to add
 * @param userSession - session object of current user
 */
export const addNewTag = async (
  tag: Partial<Tag>,
  userSession: Session,
): Promise<Tag | undefined> => {
  const user = await prisma.user.findFirst({
    where: { name: userSession?.user?.name },
  });

  if (user) {
    return prisma.tag.create({
      data: {
        name: tag.name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
  return undefined;
};

/**
 * Update given Tag
 * @param tag
 */
export const updateTag = async (tag: TagType): Promise<Tag | undefined> => {
  return prisma.tag.update({
    where: {
      id: tag.id,
    },
    data: {
      name: tag.name,
    },
  });
};

/**
 * Get all searchNotes of given tag by its ID
 * @param tagId
 * @param userSession - session object of current user
 */
export const getTagPageItems = async (tagId: string, userSession: Session) => {
  const notes = await prisma.note.findMany({
    where: {
      tags: {
        some: { id: tagId },
      },
    },
    include: {
      tags: true,
      checkPoints: true,
    },
  });

  const tags = await getAllUserTags(userSession);

  return {
    notes,
    tags,
  };
};

/**
 * Delete Tag by ID
 * @param tagId
 */
export const deleteTag = async (tagId: string) => {
  return prisma.tag.delete({ where: { id: tagId } });
};
