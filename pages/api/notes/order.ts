import {NextApiRequest, NextApiResponse} from "next";
import {Note} from "@prisma/client";
import {getSession} from "next-auth/client";
import {cRestMethods} from "../../../lib/RestAPI";
import {changeNotesOrder} from "../../../repositories/NoteRepository";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{message: string} | Note[]>
) {
    const session = await getSession({ req });

    if (session) {
        const {
            query: { id, name },
            method,
            body,
        } = req;

        switch (method) {
            case cRestMethods.PUT:
                await changeNotesOrder(JSON.parse(body));
                res.status(200).json({ message: "Notes order updated." });
                break;
            default:
                res.setHeader("Allow", ["PUT"]);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } else {
        // Not Signed in
        res.status(401);
    }
    res.end();
}
