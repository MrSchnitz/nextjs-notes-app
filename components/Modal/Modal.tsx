"use client";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";

interface Props {
  className?: string;
  onClose?: () => void;
}

export default function Modal({
  children,
  className,
  onClose,
}: PropsWithChildren<Props>) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    modalRef.current?.showModal();
  }, []);

  return createPortal(
    <dialog className="modal" ref={modalRef} onClose={onClose}>
      <div className={clsx("modal-box px-4 md:px-0 py-0 bg-transparent w-fit overflow-visible", className)}>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>,
    document.body,
  );
}
