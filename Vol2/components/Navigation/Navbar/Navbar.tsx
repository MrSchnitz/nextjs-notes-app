"use client";
import React, { ReactNode, useState } from "react";
import keepLogo from "../../../resources/assets/keep.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PAGE_LINKS } from "../../../lib/Links";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/solid";
import TagsModal from "@/components/TagsModal/TagsModal";

export interface NavbarProps {
  children: ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  const [isDrawerOpened, setDraweOpened] = useState(false);
  // const matchesMobileL = useMediaQuery(device.mobileL);

  // const [openNav, setOpenNav] = useState(!matchesMobileL);

  const { data: session } = useSession();

  const router = useRouter();
  const query = useSearchParams();
  const pathname = usePathname();

  const toggleDrawer = () => {
    setDraweOpened((prevState) => !prevState);
  };

  const renderLogo = (
    <Link href={PAGE_LINKS.landingPage}>
      <div className="[&_svg]:w-[35px] [&_svg]:h-[35px] lg:[&_svg]:w-[40px] lg:[&_svg]:h-[40px] [&_svg]:border-2 [&_svg]:border-white [&_svg]:rounded flex items-center">
        <Image
          src={keepLogo}
          alt="logo"
          height={40}
          width={40}
          className="m-2"
        />
        <h2 className="m-0 ms-2 text-white text-2xl font-bold">Notes</h2>
      </div>
    </Link>
  );

  const renderUserBar = (
    <div className="flex flex-1 items-center justify-end text-right mr-3">
      {session?.user?.image && (
        <img
          className="h-[30px] w-[30px] rounded-circle overflow-hidden"
          src={session?.user?.image}
          alt="user-image"
        />
      )}
      <h6 className="m-0 ms-2 me-3">
        <strong>{session?.user?.name}</strong>
      </h6>
      <button
        className="btn btn-sm"
        onClick={
          session
            ? () => signOut({ callbackUrl: "/" })
            : () => router.push(PAGE_LINKS.auth)
        }
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );

  return (
    <div className="drawer">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpened}
        onChange={() => {}}
      />
      <div className="drawer-content">
        <div className="w-full py-0.5 flex items-center bg-[#f5b500]">
          <Bars3Icon
            className="ml-4 text-white font-bold cursor-pointer"
            onClick={toggleDrawer}
            width={24}
            height={24}
          />
          {renderLogo}
          {renderUserBar}
        </div>
        <div className="h-[calc(100vh-64px)]">{children}</div>†
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={toggleDrawer}
        ></label>
        <div className="menu text-base-content min-h-full w-80 p-4 bg-[#f5b500]">
          <TagsModal />
        </div>
      </div>
    </div>
  );
}
