import { useCallback, useEffect, useState } from "react";

export default function useResponsive(breakpoint = 960) {
  const getMatch = useCallback(
    () =>
      typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
    [breakpoint],
  );
  const [isResponsive, setIsResponsive] = useState(getMatch);

  useEffect(() => {
    const handleResize = () => setIsResponsive(getMatch());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getMatch]);

  return isResponsive;
}
