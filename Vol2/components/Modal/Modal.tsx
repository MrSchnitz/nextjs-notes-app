"use client";
import React, { ReactNode, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
}

export default function Modal({ children }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    modalRef.current?.showModal();
  }, []);

  return (
    <dialog className="modal" ref={modalRef}>
      <div className="modal-box p-0">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
