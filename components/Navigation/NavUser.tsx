"use client";
import { signOut, useSession } from "next-auth/react";
import { PAGE_LINKS } from "@/lib/Links";
import React from "react";
import { useRouter } from "next/navigation";

const NavUser = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignClick = () => {
    if (session) {
      void signOut({ callbackUrl: "/" });
      return;
    }

    router.push(PAGE_LINKS.auth);
  };

  return (
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
      <button className="btn btn-sm" onClick={handleSignClick}>
        {session ? (
          <>
            <span className="material-icons-outlined">logout</span>
            <span className="hidden md:block">Sign out</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <span className="material-icons-outlined">login</span>
          </>
        )}
      </button>
    </div>
  );
};

export default NavUser;
