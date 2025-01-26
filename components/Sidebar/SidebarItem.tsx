import Link from "next/link";
import React, { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  icon: string;
  name: string;
  href: string;
  className?: string;
  isActive: boolean;
  sideItem?: ReactNode;
  onClick?: () => void;
};

const SidebarItem = ({
  icon,
  name,
  href,
  className,
  sideItem,
  isActive,
  onClick,
}: Props) => {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center justify-between flex-1 ml-3 px-3 py-2 btn btn-ghost w-12 overflow-hidden rounded-full sidebar-item transition-all duration-500",
        isActive && "bg-[#feefc3]",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-3">
        <span className="material-icons-outlined">{icon}</span>
        <span className="text-lg whitespace-nowrap">{name}</span>
      </div>
      {sideItem}
    </Link>
  );
};

export default SidebarItem;
