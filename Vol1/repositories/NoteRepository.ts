import { Note, PrismaClient } from "@prisma/client";
import { Session } from "next-auth";
import { NoteType } from "../models/Note";
import { TagType } from "../models/Tag";
import { CheckPointType } from "../models/CheckPointObject";
import prisma from "../lib/prisma";

/**
 * Get all searchNotes of current signed user
 * @param userSession - session object of current user
 */
export const getAllUserNotes = async (
  userSession: Session
): Promise<Note[]> => {
  const user = await prisma.user.findFirst({
    where: { name: userSession?.user?.name },
    include: {
      notes: {
        include: {
          tags: true,
          checkPoints: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (user) {
    return user.notes;
  } else {
    return [];
  }
};

/**
 * Search searchNotes of current signed user
 * @param query
 * @param userSession - session object of current user
 * @param tagId - ID of tag to search for tags notes
 */
export const searchNotes = async (
  query: string,
  userSession: Session,
  tagId?: string
): Promise<Note[]> => {
  const user = tagId
    ? await prisma.user.findFirst({
        where: { name: userSession?.user?.name },
        include: {
          notes: {
            where: {
              name: {
                contains: query,
              },
              tags: {
                some: {
                  id: tagId,
                },
              },
            },
            include: {
              tags: true,
              checkPoints: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      })
    : await prisma.user.findFirst({
        where: { name: userSession?.user?.name },
        include: {
          notes: {
            where: {
              name: {
                contains: query,
              },
            },
            include: {
              tags: true,
              checkPoints: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
  if (user) {
    return user.notes;
  } else {
    return [];
  }
};

/**
 * Add new note for currently signed user
 * @param note - note object to add
 * @param userSession - session object of current user
 */
export const addNewNote = async (
  note: NoteType,
  userSession: Session
): Promise<Note | undefined> => {
  const user = await prisma.user.findFirst({
    where: { name: userSession?.user?.name },
  });

  if (user) {
    const tags: any[] = note.tags.map((tag: TagType) => ({
      id: tag.id,
    }));

    const checkPoints: any = note.checkPoints?.map((ch: CheckPointType) => ({
      text: ch.text,
      checked: ch.checked,
    }));

    const newNote = await prisma.note.create({
      data: {
        name: note.name,
        content: note.content,
        noteType: note.noteType,
        color: note.color,
        pinned: note.pinned,
        tags: {
          connect: [...tags],
        },
        checkPoints: {
          create: [...checkPoints],
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return newNote;
  }
  return undefined;
};

/**
 * Update given Note
 * @param note
 */
export const updateNote = async (note: NoteType) => {
  const tags: any[] = note.tags.map((tag: TagType) => ({
    id: tag.id,
  }));

  const checkPoints: any = note.checkPoints?.map((ch: CheckPointType) => ({
    text: ch.text,
    checked: ch.checked,
  }));

  await prisma.checkPoint.deleteMany({
    where: { noteId: note.id },
  });

  const oldNote: any = await prisma.note.findFirst({
    where: { id: note.id },
    include: { tags: true },
  });

  const oldTags: any[] = oldNote.tags.map((tag: TagType) => ({
    id: tag.id,
  }));

  return await prisma.note.update({
    where: { id: note.id },
    data: {
      name: note.name,
      content: note.content,
      noteType: note.noteType,
      color: note.color,
      pinned: note.pinned,
      tags: {
        disconnect: [...oldTags],
        connect: [...tags],
      },
      checkPoints: {
        create: [...checkPoints],
      },
    },
  });
};

/**
 * Delete note by ID
 * @param noteId
 */
export const deleteNote = async (noteId: string) => {
  await prisma.checkPoint.deleteMany({
    where: { noteId: noteId },
  });

  return await prisma.note.delete({ where: { id: noteId } });
};
