import { RefObject, useCallback, useEffect } from "react";

export default function useClickOutside<T extends HTMLElement>({
  ref,
  onClickOutside,
}: {
  ref: RefObject<T>
  onClickOutside: () => void;
}) {
  const clickOutsideListener = useCallback(
    (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
      console.log("WOW")
        onClickOutside();
      }
    },
    [ref, onClickOutside],
  );

  useEffect(() => {
    document.addEventListener("click", clickOutsideListener);
    return () => {
      document.removeEventListener("click", clickOutsideListener);
    };
  }, [clickOutsideListener]);
}
