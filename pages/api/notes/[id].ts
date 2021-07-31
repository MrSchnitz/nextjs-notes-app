import {Note} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {deleteNote} from "../../../repositories/NoteRepository";
import {cRestMethods} from "../../../utils/restAPI";

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
