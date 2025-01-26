"use client";
import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  duration: number;
  toggle: boolean;
  disabled?: boolean;
  shouldUseInitialOpenHeight?: boolean;
};

const AnimatedHeight = ({
  children,
  className,
  toggle,
  duration,
  disabled,
  shouldUseInitialOpenHeight,
}: PropsWithChildren<Props>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initialOpenHeight = useRef<number | null>(null);

  const handleTransitionEnd = () => {
    if (!wrapperRef?.current || !toggle) {
      return;
    }
    wrapperRef.current.style.overflow = "visible";
    wrapperRef.current.style.height = "auto";
  };

  const handleOpen = () => {
    if (!wrapperRef?.current) {
      return;
    }
    wrapperRef.current.style.height = `${wrapperRef.current.scrollHeight}px`;
    wrapperRef.current.style.opacity = "1";
    initialOpenHeight.current = wrapperRef.current.scrollHeight;
  };

  const handlePrepareClose = () => {
    if (!wrapperRef?.current) {
      return;
    }
    if (initialOpenHeight.current && shouldUseInitialOpenHeight) {
      wrapperRef.current.style.height = `${initialOpenHeight.current > wrapperRef.current.scrollHeight ? initialOpenHeight.current : wrapperRef.current.scrollHeight}px`;
    } else {
      wrapperRef.current.style.height = `${wrapperRef.current.scrollHeight}px`;
    }
  };

  const handleClose = () => {
    if (!wrapperRef?.current) {
      return;
    }
    wrapperRef.current.style.height = "0px";
    wrapperRef.current.style.opacity = "0";
    initialOpenHeight.current = null;
  };

  useLayoutEffect(() => {
    if (!wrapperRef?.current) {
      return;
    }
    wrapperRef.current.style.overflow = "hidden";

    if (toggle) {
      handleOpen();
      return;
    }

    handlePrepareClose();
    // wait for next frame to apply the close transition
    requestAnimationFrame(() => {
      handleClose();
    });
  }, [toggle]);

  if (disabled) {
    return <div className={clsx("relative", className)}>{children}</div>;
  }

  return (
    <div
      className={clsx(
        "relative transition-[height,opacity] overflow-hidden h-0 opacity-0",
        className,
      )}
      style={{ transitionDuration: `${duration}ms` }}
      ref={wrapperRef}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
};

export default AnimatedHeight;
