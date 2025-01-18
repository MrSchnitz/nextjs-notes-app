import { Note } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {
  addNewNote, addNewNote2, getAllNotes,
  getUser,
  updateNote,
} from "../../../repositories/NoteRepository";
import { cRestMethods } from "../../../lib/RestAPI";
import {getSession} from "next-auth/react";

type Data = {
  message: string;
};


export async function GET(
    req: NextApiRequest,
) {
  const userNotes = await getAllNotes()
  return Response.json(userNotes)
}

export async function POST(
    req: NextApiRequest,
) {
  const data = await req.json()
  console.log("DDD",data)
  await addNewNote2(data);
  return Response.json({ message: 'Hello from Next.js!' })
}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data | Note[]>
// ) {
//   const session = await getSession({ req });
//
//   console.log("HMMMMMMMMM")
//
//   // if (session) {
//     const {
//       query: { id, name },
//       method,
//       body,
//     } = req;
//
//     switch (method) {
//       case cRestMethods.GET:
//         const userNotes = await getAllNotes()
//         res.status(200).json(userNotes);
//         break;
//       case cRestMethods.POST:
//         await addNewNote2(body);
//         res.status(201).json({ message: "Note created." });
//         break;
//       case cRestMethods.PUT:
//         await updateNote(JSON.parse(body));
//         res.status(200).json({ message: "Note updated." });
//         break;
//       default:
//         res.setHeader("Allow", ["GET", "PUT"]);
//         res.status(405).end(`Method ${method} Not Allowed`);
//     }
//   // } else {
//   //   Not Signed in
//     // res.status(401);
//   // }
//   res.end();
// }
