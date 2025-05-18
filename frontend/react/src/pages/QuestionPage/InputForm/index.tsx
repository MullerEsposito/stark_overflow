import { IconProps } from "phosphor-react";
import { ErrorMessage, InputContainer, InputGroupContainer } from "./style";
import { Label } from "@components/Label";

interface InputFormProps {
  id: string
  value: string
  label: string
  error: string | null
  tooltipText?: string
  placeholder?: string
  setValue: (value: string) => void
  validateForm: () => void
  children?:  React.ReactElement<IconProps>
}

export function InputForm({ label, tooltipText, error, value, id, placeholder, setValue, validateForm, children }: InputFormProps) {
  return (
    <InputGroupContainer>      
      <Label
        inputId={id}
        inputValue={value}
        labelText={label}
        tooltipText={tooltipText}
        error={error}
      />
      <InputContainer hasError={!!error}>
        {children}
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => validateForm()}
        />
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputGroupContainer>
  )
}