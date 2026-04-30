import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(options?: {
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          if (!options?.once) setInView(false);
          return;
        }
        setInView(true);
        if (options?.once) observer.disconnect();
      },
      {
        rootMargin: options?.rootMargin ?? "0px",
        threshold: options?.threshold ?? 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.once, options?.rootMargin, options?.threshold]);

  return { ref, inView };
}
