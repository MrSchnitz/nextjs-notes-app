import { PAGE_LINKS } from "@/lib/Links";
import Image from "next/image";
import keepLogo from "@/resources/assets/keep.svg";
import Link from "next/link";
import React from "react";

const NavLogo = () => {
  return (
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
};

export default NavLogo;
