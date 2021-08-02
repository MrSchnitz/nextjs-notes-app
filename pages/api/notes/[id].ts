import {Note} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {deleteNote, searchNotes} from "../../../repositories/NoteRepository";
import {cRestMethods} from "../../../internals/RestAPI";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Note[]>
) {

  const session = await getSession({ req });

  if (session) {
    const {
      query: { id, query, tagId },
      method,
      body,
    } = req;

    switch (method) {
      case cRestMethods.GET:
        const notes: Note[] = await searchNotes(query as string, session, tagId ? tagId as string : undefined);
        res.status(200).json(notes);
        break;
      case cRestMethods.DELETE:
        await deleteNote(id as string);
        res.status(200).json({ message: "Note deleted." });
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
