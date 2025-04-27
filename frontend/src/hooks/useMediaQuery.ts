import { useState, useEffect } from 'react';

/**
 * A hook that returns whether a media query matches.
 * Useful for responsive design and conditional rendering based on screen size.
 * 
 * @param query The media query to match
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Create a media query list
    const mediaQueryList = window.matchMedia(query);

    // Update the state when the match state changes
    const updateMatches = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQueryList.addEventListener('change', updateMatches);

    // Set the initial value
    setMatches(mediaQueryList.matches);

    // Clean up the event listener
    return () => {
      mediaQueryList.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}

// Predefined media queries for common breakpoints (based on Tailwind CSS defaults)
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)');

export default useMediaQuery;
