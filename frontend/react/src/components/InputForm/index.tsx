import { IconProps } from "phosphor-react";
import { ErrorMessage, InputContainer, InputGroupContainer } from "./style";
import { Label } from "@components/Label";
import React from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  value: string
  label: string
  error: string | null
  tooltipText?: string
  placeholder?: string
  disabled?: boolean
  setValue: (value: string) => void
  validateForm?: () => void
  children?: React.ReactElement<IconProps>
}

export function InputForm({ label, tooltipText, error, value, id, placeholder, disabled = false, setValue, validateForm, children, ...props }: InputFormProps) {
  return (
    <InputGroupContainer>
      <Label
        inputId={id}
        inputValue={value}
        labelText={label}
        tooltipText={tooltipText}
        error={error}
      />
      <InputContainer $hasError={!!error}>
        {children}
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={() => validateForm && validateForm()}
          onBlur={() => validateForm && validateForm()}
          {...props}
        />
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputGroupContainer>
  )
}