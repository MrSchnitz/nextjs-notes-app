"use client";
import React from "react";
import Image from "next/image";
import notFoundGif from "../resources/assets/404.gif";
import Link from "next/link";
import { PAGE_LINKS } from "@/lib/Links";

export default function NotFoundPage() {
  return (
    <div className="h-page w-full flex justify-center items-center">
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-8xl text-white font-bold">
          404
        </h1>
        <Image src={notFoundGif} alt="Confused John Travolta GIF" />
        <Link className="btn w-full text-xl" href={PAGE_LINKS.landingPage}>
          Go back to safety
        </Link>
      </div>
    </div>
  );
}
