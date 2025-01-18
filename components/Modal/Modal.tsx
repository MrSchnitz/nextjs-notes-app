"use client";
import React, { ReactNode, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
  onClose?: () => void;
}

export default function Modal({ children, onClose }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    modalRef.current?.showModal();
  }, []);

  return (
    <dialog className="modal" ref={modalRef} onClose={onClose}>
      <div className="modal-box p-0 w-fit">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
