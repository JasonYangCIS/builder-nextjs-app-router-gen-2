import type { FocusEvent } from "react";

export interface SearchFormProps {
  query: string;
  onChange: (value: string) => void;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isExpanded: boolean;
  placeholder: string;
  searchLabel: string;
  /** Unique id for the input element — generated via useId() in the parent */
  inputId: string;
  /** Unique id for the results listbox — generated via useId() in the parent */
  resultsId: string;
}
