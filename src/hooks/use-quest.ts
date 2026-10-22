import { useCallback, useEffect, useRef, useState } from "react";

import { createInitialQuest, parseSavedQuest, type QuestState } from "@/lib/quest";

const STORAGE_KEY = "wonder-quest:v1";

/** Quest state kept in this browser only (free play, no account). */
export function useQuest() {
  const [quest, setQuest] = useState<QuestState>(() => createInitialQuest());
  const [hydrated, setHydrated] = useState(false);
  const [imagesNotSaved, setImagesNotSaved] = useState(false);
  const skipNextSave = useRef(true);

  useEffect(() => {
    const saved = parseSavedQuest(window.localStorage.getItem(STORAGE_KEY));
    if (saved) setQuest(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quest));
      setImagesNotSaved(false);
    } catch {
      // Browser storage is full (large worksheet images): keep the text, drop images.
      try {
        const lite = {
          ...quest,
          checkpoints: quest.checkpoints.map((cp) => ({ ...cp, image: null, imageName: null })),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lite));
      } catch {
        /* ignore */
      }
      setImagesNotSaved(true);
    }
  }, [quest, hydrated]);

  const update = useCallback((fn: (q: QuestState) => QuestState) => setQuest(fn), []);

  return { quest, setQuest, update, hydrated, imagesNotSaved };
}

/** Smoothly counts toward the target number. */
export function useAnimatedNumber(target: number, duration = 650) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    if (reduce || from === target) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      fromRef.current = target;
    };
  }, [target, duration]);

  return value;
}
