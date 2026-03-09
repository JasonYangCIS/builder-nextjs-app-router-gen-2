export interface InputProps {
  /** Visible label — rendered in a <label> and associated via htmlFor */
  label?: string;
  /** HTML input type */
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Helper text shown below the input */
  helperText?: string;
  /** Error message — shown instead of helperText, sets aria-invalid */
  errorText?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
}
