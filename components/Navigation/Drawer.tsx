"use client";
import React, {
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import clsx from "clsx";

type Props = {
  header: ReactNode;
  side: ReactNode;
  isToggleHidden?: boolean;
};

const Drawer = forwardRef(
  (
    { children, header, side, isToggleHidden }: PropsWithChildren<Props>,
    ref,
  ) => {
    const [isDrawerOpened, setDrawerOpened] = useState(false);

    const toggleDrawer = () => {
      setDrawerOpened((prevState) => !prevState);
    };

    useImperativeHandle(
      ref,
      () => ({
        toggle: toggleDrawer,
      }),
      [],
    );

    useEffect(() => {
      if (window?.matchMedia("(min-width: 768px)").matches) {
        setDrawerOpened(true);
      }
    }, []);

    return (
      <>
        <div className="w-full py-0.5 flex items-center bg-[#f5b500]">
          {!isToggleHidden && (
            <button
              className="ml-4 btn btn-ghost btn-circle"
              onClick={toggleDrawer}
            >
              <Bars3Icon
                className="text-white font-bold cursor-pointer"
                width={24}
                height={24}
              />
            </button>
          )}
          {header}
        </div>
        <div className="w-full flex">
          {!isToggleHidden && (
            <>
              <input
                id="my-drawer"
                type="checkbox"
                className="drawer-toggle [&:checked~.side_.sidebar-item]:w-40 md:[&:checked~.side_.sidebar-item]:w-72 [&:checked~.side_.sidebar-item]:rounded-l-none [&:checked~.side_.sidebar-item]:rounded-r-full [&:checked~.side_.sidebar-item]:ml-0 [&:checked~.side_.sidebar-item]:pl-6"
                checked={isDrawerOpened}
                onChange={() => {}}
              />
              <div
                className={clsx(
                  "fixed md:static z-50 bg-white md:bg-transparent mt-2 text-base-content min-h-full side",
                )}
              >
                {side}
              </div>
            </>
          )}
          <div
            className={clsx(
              "w-full min-h-[calc(100svh-60px)]",
              !isToggleHidden && "ml-16 md:ml-0",
            )}
          >
            {children}
          </div>
        </div>
      </>
    );
  },
);

export default Drawer;
