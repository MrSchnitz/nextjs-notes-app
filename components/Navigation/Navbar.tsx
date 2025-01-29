import React, { ReactNode } from "react";
import Drawer from "@/components/Navigation/Drawer";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavLogo from "@/components/Navigation/NavLogo";
import NavUser from "@/components/Navigation/NavUser";
import SidebarWrapper from "@/components/Sidebar/SidebarWrapper";

export interface NavbarProps {
  children: ReactNode;
}

export default async function Navbar({ children }: NavbarProps) {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <Drawer
      header={
        <>
          <NavLogo />
          <NavUser />
        </>
      }
      side={<SidebarWrapper />}
      isToggleHidden={!session}
    >
      {children}
    </Drawer>
  );
}
