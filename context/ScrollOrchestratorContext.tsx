"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScrollOrchestratorValue {
  /** Normalized page scroll position: 0.0 (top) → 1.0 (bottom). */
  scrollProgress: number;

  /** 0-based focused card index for the left (Experience) column. */
  leftFocusedIndex: number;

  /** 0-based focused card index for the right (Projects) column. */
  rightFocusedIndex: number;

  /** Called by CardDeck (ISSUE-006) to report the active left-column card. */
  setLeftFocusedIndex: (index: number) => void;

  /** Called by CardDeck (ISSUE-006) to report the active right-column card. */
  setRightFocusedIndex: (index: number) => void;

  /** Smooth-scrolls the page to the very top (hero). */
  jumpToHero: () => void;

  /** Smooth-scrolls the page to the very bottom (footer). */
  jumpToFooter: () => void;

  /**
   * True while a CardGrid item is expanded. SceneManager reads this to
   * trigger the Z-Lunge camera dive into the constellation.
   */
  cardExpanded: boolean;
  setCardExpanded: (expanded: boolean) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ScrollOrchestratorContext =
  createContext<ScrollOrchestratorValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ScrollOrchestratorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [leftFocusedIndex, setLeftFocusedIndex] = useState(0);
  const [rightFocusedIndex, setRightFocusedIndex] = useState(0);
  const [cardExpanded, setCardExpanded] = useState(false);

  // Track the latest raw scrollY without triggering re-renders on every pixel
  const latestScrollY = useRef(0);
  const rafPending = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    function computeProgress() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrollProgress(
        maxScroll <= 0
          ? 0
          : Math.min(1, Math.max(0, latestScrollY.current / maxScroll))
      );
      rafPending.current = false;
    }

    function handleScroll() {
      latestScrollY.current = window.scrollY;

      // Coalesce rapid scroll events: one rAF write per animation frame
      if (!rafPending.current) {
        rafPending.current = true;
        rafId.current = requestAnimationFrame(computeProgress);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initialise on mount (handles cases where page doesn't start at top)
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const jumpToHero = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const jumpToFooter = useCallback(() => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll, behavior: "smooth" });
  }, []);

  return (
    <ScrollOrchestratorContext.Provider
      value={{
        scrollProgress,
        leftFocusedIndex,
        rightFocusedIndex,
        setLeftFocusedIndex,
        setRightFocusedIndex,
        jumpToHero,
        jumpToFooter,
        cardExpanded,
        setCardExpanded,
      }}
    >
      {children}
    </ScrollOrchestratorContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

/**
 * Access the ScrollOrchestrator from any client component.
 *
 * Throws if called outside of `<ScrollOrchestratorProvider>`.
 */
export function useScrollOrchestrator(): ScrollOrchestratorValue {
  const ctx = useContext(ScrollOrchestratorContext);
  if (!ctx) {
    throw new Error(
      "useScrollOrchestrator must be used within a <ScrollOrchestratorProvider>. " +
        "Make sure ScrollOrchestratorProvider is in your component tree (e.g. via app/providers.tsx)."
    );
  }
  return ctx;
}
