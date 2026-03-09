"use client";

import { useId } from "react";
import { cn } from "@/utils/cn";
import type { InputProps } from "./Input.types";

export function Input({
  label,
  type = "text",
  name,
  id,
  value,
  defaultValue,
  placeholder,
  helperText,
  errorText,
  disabled = false,
  required = false,
  autoComplete,
  onChange,
  onBlur,
  onFocus,
  className,
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const hasError = Boolean(errorText);
  const supportText = errorText ?? helperText;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-error-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={supportText ? helperId : undefined}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={cn(
          // Base
          "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900",
          "placeholder:text-zinc-400",
          "transition-colors duration-150",
          // Border
          hasError ? "border-error-600" : "border-zinc-300",
          // Focus — WCAG 2.1 AA: visible focus ring
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          hasError
            ? "focus:ring-error-600 focus:border-error-600"
            : "focus:ring-brand-600 focus:border-brand-600",
          // Disabled
          "disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:border-zinc-200"
        )}
      />

      {supportText && (
        <p
          id={helperId}
          className={cn(
            "text-xs leading-normal",
            hasError ? "text-error-600" : "text-zinc-500"
          )}
          role={hasError ? "alert" : undefined}
        >
          {supportText}
        </p>
      )}
    </div>
  );
}
