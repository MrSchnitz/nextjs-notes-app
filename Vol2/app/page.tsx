"use client";
import { PAGE_LINKS } from "@/lib/Links";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const { replace } = useRouter();

  if (session) {
    replace(PAGE_LINKS.notesPage);
  }

  return (
    <main className="h-full flex flex-col justify-center items-center">
      <h1 className="mb-4 font-bold text-6xl text-[#f5b500]">Notes App</h1>
      <Link className="btn btn-sm" href={PAGE_LINKS.auth}>
        Sign in
      </Link>
      <h2 className="mt-4 mb-4 text-[#8a8a8a]">
        Capture what&apos;s on your mind
      </h2>
    </main>
  );
}
