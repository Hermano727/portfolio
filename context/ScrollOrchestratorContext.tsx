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

/** Deck vs contact: contact means the contact modal is open (not in-page scroll). */
export type PageScrollZone = "deck" | "contact";

export interface ScrollOrchestratorValue {
  /** Normalized page scroll position: 0.0 (top) → 1.0 (bottom of document). */
  scrollProgress: number;

  /**
   * Scroll progress mapped from page top through the bottom of `#deck-cards`,
   * clamped at 1 while the contact modal is open. Drives SceneManager / visuals.
   */
  sceneScrollProgress: number;

  /** `deck` on the grid; `contact` while the contact modal is open. */
  scrollZone: PageScrollZone;

  /** 0-based focused card index for the left (Experience) column. */
  leftFocusedIndex: number;

  /** 0-based focused card index for the right (Projects) column. */
  rightFocusedIndex: number;

  /** Called by CardDeck (ISSUE-006) to report the active left-column card. */
  setLeftFocusedIndex: (index: number) => void;

  /** Called by CardDeck (ISSUE-006) to report the active right-column card. */
  setRightFocusedIndex: (index: number) => void;

  /**
   * Registers the scrollable deck container used for internal scroll UX.
   * When set, the orchestrator computes `scrollProgress` /
   * `sceneScrollProgress` from `el.scrollTop` instead of `window.scrollY`.
   */
  registerDeckScrollContainer: (el: HTMLDivElement | null) => void;

  /**
   * Returns to the intro hero when registered (see `registerReturnToHero`);
   * otherwise smooth-scrolls to the top of the document.
   */
  jumpToHero: () => void;

  /** Set by `HomeContent` so `jumpToHero` can remount the hero instead of only scrolling. */
  registerReturnToHero: (fn: (() => void) | null) => void;

  /** Opens the contact modal (and sets `#contact` in the URL when applicable). */
  jumpToFooter: () => void;

  /** Contact modal visibility — driven by `jumpToFooter` / user dismiss / hash. */
  contactModalOpen: boolean;
  setContactModalOpen: (open: boolean) => void;

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
  const [sceneScrollProgress, setSceneScrollProgress] = useState(0);
  const [scrollZone, setScrollZone] = useState<PageScrollZone>("deck");
  const [leftFocusedIndex, setLeftFocusedIndex] = useState(0);
  const [rightFocusedIndex, setRightFocusedIndex] = useState(0);
  const [cardExpanded, setCardExpanded] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const latestScrollY = useRef(0);
  const rafPending = useRef(false);
  const rafId = useRef<number | null>(null);
  const returnToHeroRef = useRef<(() => void) | null>(null);
  const contactModalOpenRef = useRef(contactModalOpen);
  contactModalOpenRef.current = contactModalOpen;

  // Deck internal scroll registration. Stored in a ref so `flushProgress`
  // can read it without being recreated.
  const deckScrollElRef = useRef<HTMLDivElement | null>(null);
  const [deckScrollElState, setDeckScrollElState] =
    useState<HTMLDivElement | null>(null);
  useEffect(() => {
    deckScrollElRef.current = deckScrollElState;
    latestScrollY.current = deckScrollElState ? deckScrollElState.scrollTop : 0;
  }, [deckScrollElState]);

  const flushProgress = useCallback(() => {
    const deckEl = deckScrollElRef.current;

    if (contactModalOpenRef.current) {
      setScrollZone("contact");
      setSceneScrollProgress(1);
      return;
    }

    // Deck internal scroll path (preferred).
    if (deckEl) {
      const y = latestScrollY.current;
      const maxScroll = Math.max(0, deckEl.scrollHeight - deckEl.clientHeight);
      setScrollProgress(maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, y / maxScroll)));
      setScrollZone("deck");

      // Bias the divisor so the background/scene completes slightly before
      // the absolute bottom of the deck.
      const denom = Math.max(1, maxScroll - deckEl.clientHeight * 0.12);
      setSceneScrollProgress(Math.min(1, Math.max(0, y / denom)));
      return;
    }

    // Window scroll fallback.
    const y = latestScrollY.current;
    const vh = window.innerHeight;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);

    setScrollProgress(maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, y / maxScroll)));

    setScrollZone("deck");

    const deckCards = document.getElementById("deck-cards");
    if (deckCards) {
      const rect = deckCards.getBoundingClientRect();
      const deckBottomDoc = rect.bottom + window.scrollY;
      const denom = Math.max(1, deckBottomDoc - vh * 0.12);
      setSceneScrollProgress(Math.min(1, Math.max(0, y / denom)));
    } else {
      setSceneScrollProgress(0);
    }
  }, []);

  useEffect(() => {
    const deckEl = deckScrollElRef.current;
    const target: EventTarget = deckEl ?? window;

    function handleScroll() {
      latestScrollY.current = deckScrollElRef.current
        ? deckScrollElRef.current.scrollTop
        : window.scrollY;

      if (!rafPending.current) {
        rafPending.current = true;
        rafId.current = requestAnimationFrame(() => {
          flushProgress();
          rafPending.current = false;
        });
      }
    }

    (target as any).addEventListener("scroll", handleScroll, { passive: true });

    latestScrollY.current = deckEl ? deckEl.scrollTop : window.scrollY;
    flushProgress();

    return () => {
      (target as any).removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [flushProgress, deckScrollElState]);

  useEffect(() => {
    latestScrollY.current = deckScrollElRef.current
      ? deckScrollElRef.current.scrollTop
      : window.scrollY;
    flushProgress();
  }, [contactModalOpen, flushProgress]);

  const registerReturnToHero = useCallback((fn: (() => void) | null) => {
    returnToHeroRef.current = fn;
  }, []);

  const registerDeckScrollContainer = useCallback(
    (el: HTMLDivElement | null) => {
      setDeckScrollElState(el);
    },
    [],
  );

  const jumpToHero = useCallback(() => {
    setCardExpanded(false);
    setContactModalOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#contact") {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
    const back = returnToHeroRef.current;
    if (back) {
      back();
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const jumpToFooter = useCallback(() => {
    setContactModalOpen(true);
    if (typeof window !== "undefined") {
      const { pathname, search } = window.location;
      window.history.replaceState(null, "", `${pathname}${search}#contact`);
    }
  }, []);

  return (
    <ScrollOrchestratorContext.Provider
      value={{
        scrollProgress,
        sceneScrollProgress,
        scrollZone,
        leftFocusedIndex,
        rightFocusedIndex,
        setLeftFocusedIndex,
        setRightFocusedIndex,
        registerDeckScrollContainer,
        jumpToHero,
        registerReturnToHero,
        jumpToFooter,
        contactModalOpen,
        setContactModalOpen,
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
        "Make sure ScrollOrchestratorProvider is in your component tree (e.g. via app/providers.tsx).",
    );
  }
  return ctx;
}
