import {Tag} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {cRestMethods} from "../../../utils/restAPI";
import {addNewTag, getAllUserTags, updateTag} from "../../../repositories/TagRepository";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Tag[]>
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
        const userTags = await getAllUserTags(session);
        res.status(200).json(userTags);
        break;
      case cRestMethods.POST:
        await addNewTag(body, session);
        res.status(201).json({ message: "Tag created." });
        break;
      case cRestMethods.PUT:
        await updateTag(JSON.parse(body));
        res.status(200).json({ message: "Tag updated." });
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
