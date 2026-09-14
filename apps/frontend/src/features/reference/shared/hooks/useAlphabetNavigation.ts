import {
  type RefCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface UseAlphabetNavigationOptions {
  stickyOffset?: number;
}

export function useAlphabetNavigation({
  stickyOffset = 0,
}: UseAlphabetNavigationOptions = {}) {
  const [activeLetter, setActiveLetter] = useState<string | false>(false);

  const elements = useRef(new Map<string, HTMLElement>());

  const registerLetter = useCallback(
    (letter: string): RefCallback<HTMLElement> =>
      (element) => {
        if (element) {
          elements.current.set(letter, element);
        } else {
          elements.current.delete(letter);
        }
      },
    [],
  );

  useEffect(() => {
    let animationFrame: number | undefined;

    const updateActiveLetter = () => {
      animationFrame = undefined;

      const headings = [...elements.current.entries()];

      if (headings.length === 0) {
        setActiveLetter(false);
        return;
      }

      let currentLetter = headings[0][0];

      for (const [letter, element] of headings) {
        const top = element.getBoundingClientRect().top;

        if (top <= stickyOffset + 1) {
          currentLetter = letter;
        } else {
          break;
        }
      }

      setActiveLetter((current) =>
        current === currentLetter ? current : currentLetter,
      );
    };

    const handleScroll = () => {
      if (animationFrame !== undefined) {
        return;
      }

      animationFrame = requestAnimationFrame(updateActiveLetter);
    };

    updateActiveLetter();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [stickyOffset]);

  const selectLetter = useCallback(
    (letter: string, behavior: ScrollBehavior = "smooth") => {
      const element = elements.current.get(letter);

      if (!element) {
        return;
      }

      setActiveLetter(letter);

      element.scrollIntoView({
        behavior,
        block: "start",
      });
    },
    [],
  );

  return {
    activeLetter,
    registerLetter,
    selectLetter,
  };
}
