import {Note} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {addNewNote, getAllUserNotes, updateNote,} from "../../../repositories/NoteRepository";
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
      query: { id, name },
      method,
      body,
    } = req;

    switch (method) {
      case cRestMethods.GET:
        const userNotes = await getAllUserNotes(session);
        res.status(200).json(userNotes);
        break;
      case cRestMethods.POST:
        await addNewNote(body, session);
        res.status(201).json({ message: "Note created." });
        break;
      case cRestMethods.PUT:
        await updateNote(JSON.parse(body));
        res.status(200).json({ message: "Note updated." });
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
