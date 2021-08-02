import { Note, PrismaClient, Tag } from "@prisma/client";
import { Session } from "next-auth";
import { TagType } from "../models/Tag";

/**
 * Get all tags of current signed user
 * @param userSession - session object of current user
 */
export const getAllUserTags = async (userSession: Session): Promise<Tag[]> => {
  const prisma = new PrismaClient();

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
  tag: Tag,
  userSession: Session
): Promise<Tag | undefined> => {
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
    where: { name: userSession?.user?.name },
  });

  if (user) {
    const newTag = await prisma.tag.create({
      data: {
        name: tag.name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return newTag;
  }
  return undefined;
};

/**
 * Update given Tag
 * @param tag
 */
export const updateTag = async (tag: TagType): Promise<Tag | undefined> => {
  const prisma = new PrismaClient();

  return await prisma.tag.update({
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
 */
export const getTagNotes = async (tagId: string): Promise<Note[]> => {
  const prisma = new PrismaClient();

  return await prisma.note.findMany({
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
};

/**
 * Delete Tag by ID
 * @param tagId
 */
export const deleteTag = async (tagId: string) => {
  const prisma = new PrismaClient();
  return await prisma.tag.delete({ where: { id: tagId } });
};
