import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllUserTags } from "@/repositories/TagRepository";
import Sidebar from "@/components/Sidebar/Sidebar";

export default async function SidebarWrapper() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const userTags = await getAllUserTags(session);

  if (!userTags) {
    return null;
  }

  return <Sidebar tags={userTags} />;
}
