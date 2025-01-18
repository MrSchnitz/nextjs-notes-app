import React, {
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";

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
    const [isDrawerOpened, setDraweOpened] = useState(false);

    const toggleDrawer = () => {
      setDraweOpened((prevState) => !prevState);
    };

    useImperativeHandle(
      ref,
      () => ({
        toggle: toggleDrawer,
      }),
      [],
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
            {!isToggleHidden && (
              <div className="ml-4 btn btn-ghost btn-circle">
                <Bars3Icon
                  className="text-white font-bold cursor-pointer"
                  onClick={toggleDrawer}
                  width={24}
                  height={24}
                />
              </div>
            )}
            {header}
          </div>
          <div className="h-[calc(100vh-64px)]">{children}</div>
        </div>
        <div className="drawer-side top-[60px] z-50">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay !bg-transparent"
            onClick={toggleDrawer}
          ></label>
          <div className="menu text-base-content min-h-full w-80 p-4 bg-[#f5b500]">
            {side}
          </div>
        </div>
      </div>
    );
  },
);

export default Drawer;
