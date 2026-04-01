import { useEffect, useState } from 'react';

export default function useResponsive(breakpoint = 960) {
  const getMatch = () => (typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false);
  const [isResponsive, setIsResponsive] = useState(getMatch);

  useEffect(() => {
    const handleResize = () => setIsResponsive(getMatch());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isResponsive;
}
