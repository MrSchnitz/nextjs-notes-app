import { useEffect, useState } from "react";

export default function useSwitchTimeout(delay: number) {
  const [switchContent, setSwitchContent] = useState(true);

  useEffect(() => {
    let timer = setTimeout(
      () => setSwitchContent((prevState) => !prevState),
      delay * 1000
    );

    return () => {
      clearTimeout(timer);
    };
  }, [switchContent, delay]);

  return { switchContent, setSwitchContent };
}
