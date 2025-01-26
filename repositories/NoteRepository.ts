import { Session } from "next-auth";
import { NoteType } from "@/models/Note";
import { TagType } from "@/models/Tag";
import { CheckPointType } from "@/models/CheckPointObject";
import prisma from "../lib/prisma";
import { Note, User } from "@prisma/client";

/**
 * Get all searchNotes of current signed user
 * @param userSession - session object of current user
 */
export const getUser = async (userSession: Session) => {
  const user = await prisma.user.findFirst({
    where: { name: userSession?.user?.name },
    include: {
      tags: {
        orderBy: {
          createdAt: "asc",
        },
      },
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
    return user;
  } else {
    return [];
  }
};

export const updateNoteOrder = async (
  userSession: Session,
  noteOrder: string,
) => {
  return prisma.user.update({
    where: { email: userSession?.user?.email },
    data: {
      noteOrder: noteOrder,
    },
  });
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
  tagId?: string,
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
  userSession: Session,
): Promise<Note | undefined> => {
  const user = await prisma.user.findFirst({
    where: { name: userSession?.user?.name },
  });

  if (user) {
    const tags =
      note.tags?.map((tag: TagType) => ({
        id: tag.id,
      })) ?? [];

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
        image: note.image,
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

    try {
      const noteOrder = JSON.parse(user.noteOrder ?? "[]");
      const updatedNoteOrder = JSON.stringify([newNote.id, ...noteOrder]);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          noteOrder: updatedNoteOrder,
        },
      });
    } catch (e) {
      console.log("Update note order error", e);
      throw e;
    }

    return newNote;
  }
  return undefined;
};

/**
 * Update given Note
 * @param note
 */
export const updateNote = async (note: NoteType) => {
  const tags =
    note.tags?.map((tag: TagType) => ({
      id: tag.id,
    })) ?? [];

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

  return prisma.note.update({
    where: { id: note.id },
    data: {
      name: note.name,
      content: note.content,
      noteType: note.noteType,
      color: note.color,
      pinned: note.pinned,
      image: note.image,
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
export const deleteNote = async (noteId: string, userSession: Session) => {
  const user = await prisma.user.findFirst({
    where: { email: userSession?.user?.email },
  });

  try {
    const noteOrder = JSON.parse(user.noteOrder ?? "[]");
    const updatedNoteOrder = JSON.stringify(
      noteOrder.filter((id: string) => id !== noteId),
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        noteOrder: updatedNoteOrder,
      },
    });
  } catch (e) {
    console.log("Delete note order error", e);
    throw e;
  }

  await prisma.checkPoint.deleteMany({
    where: { noteId: noteId },
  });

  return prisma.note.delete({ where: { id: noteId } });
};
