import type { FocusEvent } from "react";

export interface SearchFormProps {
  query: string;
  onChange: (value: string) => void;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  placeholder: string;
  searchLabel: string;
  /** Unique id for the input — generated via useId() in the parent, links the label */
  inputId: string;
}
