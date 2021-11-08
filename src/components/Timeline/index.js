import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const Context = React.createContext();

export const useTimeline = () => {
  return useContext(Context);
};

export const Entry = ({
  year,
  title,
  product,
  icon = null,
  categories,
  children,
}) => {
  const ctx = useTimeline();
  const nc = categories.map(normalize);

  useEffect(() => {
    const unregister = ctx.register(product, categories);
    return unregister;
  }, []);

  const all = !Object.getOwnPropertyNames(ctx.filters).reduce((prev, cat) => {
    const enabled = ctx.filters[cat];
    return prev || enabled;
  }, false);

  const show = Object.getOwnPropertyNames(ctx.filters).reduce((prev, cat) => {
    return prev && nc.includes(cat);
  }, true);

  if (!all && !show) {
    return null;
  }

  return (
    <div className="flex flex-row mb-10">
      <div>
        <div className="pr-5 text-left lg:text-right w-full lg:w-36 ml-0 lg:-ml-36 pt-3">
          {year}
        </div>
      </div>
      <div>
        <div className="flex flex-row">
          {!icon ? null : <></>}
          <h3 className="py-0 font-bold text-3xl">{product}</h3>
        </div>
        <div className="text-gray-500 italic mt-2">{title}</div>
        <div className="mt-5 prose dark:prose-dark max-w-none">{children}</div>
      </div>
    </div>
  );
};

const normalize = (c) =>
  `${c}`
    .toLowerCase()
    .split(" ")
    .map((w) => `${w[0].toUpperCase()}${w.substr(1)}`)
    .join(" ");

export default function Timeline({ initialFilters = {}, children } = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [registry, setRegistry] = useState({});

  const toggleFilter = useCallback((f) => {
    // all (regardless of click) resets
    if (f === "All") {
      setFilters({});
      return;
    }

    // Everything else is on/off
    setFilters((last) => {
      const next = { ...last };
      if (next[f]) {
        delete next[f];
      } else {
        next[f] = true;
      }
      return next;
    });
  }, []);

  // counts based on the current filters
  const facetCounts = useMemo(() => {
    const counts = {};
    Object.getOwnPropertyNames(registry).forEach((id) => {
      const entry = registry[id];
      const include = Object.getOwnPropertyNames(filters).reduce(
        (prev, cat) => {
          if (filters[cat] === false) {
            return prev;
          }
          return prev && entry.categories.includes(cat);
        },
        true
      );

      entry.categories.map((cat) => {
        counts[cat] = (counts[cat] || 0) + (include ? 1 : 0);
      });

      counts.all = (counts.all || 0) + 1;
    });
    return counts;
  }, [filters, registry]);

  const register = useCallback((id, cats = []) => {
    setRegistry((last) => ({
      ...last,
      [id]: {
        categories: cats.map(normalize),
      },
    }));

    return () => {
      setRegistry((last) => {
        const next = { ...last };
        delete next[id];
        return next;
      });
    };
  }, []);

  const payload = useMemo(
    () => ({
      register,
      toggleFilter,
      facetCounts,
      filters,
    }),
    [register, toggleFilter, facetCounts, filters]
  );

  return <Context.Provider value={payload}>{children}</Context.Provider>;
}
