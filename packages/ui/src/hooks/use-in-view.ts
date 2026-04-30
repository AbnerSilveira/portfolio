import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions extends IntersectionObserverInit {
  /** Dispara apenas uma vez quando entra na viewport */
  once?: boolean;
}

export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {},
) {
  const {
    once = true,
    root = null,
    rootMargin = "0px 0px -10% 0px",
    threshold = 0.15,
  } = options;

  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  return { ref, inView };
}
