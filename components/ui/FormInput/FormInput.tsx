"use client"

import { useId } from "react"
import { cn } from "@/utils/cn"
import { Input } from "@/components/ui/Input/Input"
import { Label } from "@/components/ui/Label/Label"

export interface FormInputProps {
  label?: string
  type?: React.HTMLInputTypeAttribute
  name?: string
  id?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  helperText?: string
  errorText?: string
  disabled?: boolean
  required?: boolean
  autoComplete?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  className?: string
}

export function FormInput({
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
}: FormInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helperId = `${inputId}-helper`
  const hasError = Boolean(errorText)
  const supportText = errorText ?? helperText

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-hidden="true">*</span>
          )}
        </Label>
      )}

      <Input
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
        aria-invalid={hasError || undefined}
        aria-describedby={supportText ? helperId : undefined}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      {supportText && (
        <p
          id={helperId}
          className={cn(
            "text-xs leading-normal",
            hasError ? "text-destructive" : "text-muted-foreground"
          )}
          role={hasError ? "alert" : undefined}
        >
          {supportText}
        </p>
      )}
    </div>
  )
}
