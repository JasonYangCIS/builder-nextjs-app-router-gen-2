export interface SearchFormProps {
  query: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  placeholder: string;
  searchLabel: string;
}
