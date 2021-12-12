import React from "react";
import Prism from "prismjs";
import { useIsomorphicLayoutEffect } from "react-use";

Prism.languages.gql = Prism.languages.graphql;

export function usePrism<T extends HTMLElement>(
  target: React.RefObject<T>,
  plugins: string[] = []
) {
  useIsomorphicLayoutEffect(() => {
    if (target.current) {
      if (plugins.length > 0) {
        target.current.classList.add(...plugins);
      }
      // Highlight all <pre><code>...</code></pre> blocks contained by this element
      Prism.highlightAllUnder(target.current);
    }
  }, [target, plugins]);
}
