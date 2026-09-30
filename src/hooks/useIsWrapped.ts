import React from "react";

/**
 * Tracks whether a flex-wrap container's children are laid out on more than
 * one row. Attach the returned ref to the container; `deps` should list the
 * values whose change can alter the number of children.
 */
export function useIsWrapped<T extends HTMLElement>(deps: React.DependencyList) {
  const ref = React.useRef<T>(null);
  const [isWrapped, setIsWrapped] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const tops = Array.from(element.children).map((child) => (child as HTMLElement).offsetTop);
      setIsWrapped(new Set(tops).size > 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, isWrapped };
}
