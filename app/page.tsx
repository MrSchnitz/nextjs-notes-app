import { PAGE_LINKS } from "@/lib/Links";
import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";
import LightBulb from "@/resources/assets/lightbulb3.jpg";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(PAGE_LINKS.notesPage);
  }

  return (
    <main className="h-full hero bg-[#e1d8d1]">
      <div className="hero-content flex-col p-0 lg:flex-row">
        <Image
          src={LightBulb}
          alt="light bulb"
          className="max-w-sm rounded-lg"
        />
        <div className="flex flex-col md:items-start">
          <h1 className="text-5xl font-bold">Notes App</h1>
          <p className="py-6">Capture what&apos;s on your mind</p>
          <Link className="btn btn-sm" href={PAGE_LINKS.auth}>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
