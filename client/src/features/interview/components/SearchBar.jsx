import { Loader2, Search, X } from "lucide-react";

/**
 * Fully controlled search input. All timing/debounce logic lives in
 * useSearchReports; this component only renders and forwards events.
 *
 * Width is intentionally unconstrained here (just `w-full`) so the parent
 * layout controls how much horizontal space it takes - see Home.jsx, where
 * it now sits in a flex-1 wrapper next to the Create button.
 */
export default function SearchBar({ value, onChange, onClear, isSearching, placeholder }) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || "Search your interview reports..."}
        className="w-full rounded-full border border-[#ECE5EA] bg-white py-3 pl-11 pr-11 text-sm text-[#1F1F1F] shadow-sm outline-none transition placeholder:text-[#999999] focus:border-[#C74D81] focus:ring-4 focus:ring-[#EAA7C4]/30"
      />

      {isSearching && (
        <Loader2
          size={16}
          className="absolute right-11 top-1/2 -translate-y-1/2 animate-spin text-[#C74D81]"
        />
      )}

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#FAF8FB] hover:text-[#1F1F1F]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}