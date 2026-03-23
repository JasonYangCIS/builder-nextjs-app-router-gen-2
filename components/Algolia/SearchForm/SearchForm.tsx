import type { SearchFormProps } from "./SearchForm.types";

export type { SearchFormProps } from "./SearchForm.types";

export default function SearchForm({
  query,
  onChange,
  isLoading,
  placeholder,
  searchLabel,
}: SearchFormProps) {
  return (
    <div className="relative flex items-center">
      <label className="sr-only" htmlFor="algolia-search-input">
        {searchLabel}
      </label>
      <input
        id="algolia-search-input"
        className="w-full h-10 pl-3 pr-10 border border-border rounded-[var(--radius)] bg-background text-foreground text-sm leading-normal outline-none placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 focus:border-ring focus:shadow-[0_0_0_2px_var(--ring)] motion-reduce:transition-none [&::-webkit-search-cancel-button]:appearance-none"
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        suppressHydrationWarning
      />
      {isLoading && (
        <span
          className="absolute right-3 size-4 rounded-full border-2 border-muted border-t-primary animate-spin motion-reduce:animate-none motion-reduce:opacity-50"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
