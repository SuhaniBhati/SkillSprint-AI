import { useEffect, useState } from "react";

const DEFAULT_DELAY_MS = 300;

/**
 * Manages a text query and produces a debounced version of it, so the
 * caller can trigger a server-side search only after the user pauses typing.
 * @param {number} delay - debounce delay in ms (default 300)
 */
export default function useSearchReports(delay = DEFAULT_DELAY_MS) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const clearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    clearQuery,
    isSearching: query.trim() !== debouncedQuery,
  };
}