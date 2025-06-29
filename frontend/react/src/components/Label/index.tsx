import { Info } from "phosphor-react";
import { LabelContainer, Tooltip, TooltipText, ValidationIndicator } from "./style";

interface LabelProps {
  inputId: string
  inputValue: string
  labelText: string
  tooltipText?: string
  error?: string | null
}

export function Label({ labelText, inputValue, inputId, tooltipText, error }: LabelProps) {
  return (
    <LabelContainer htmlFor={inputId}>
      {labelText}
      <Tooltip>
        <Info size={16} />
        {tooltipText && <TooltipText>{tooltipText}</TooltipText>}
      </Tooltip>
      <ValidationIndicator $valid={!error && inputValue.length > 0} />
    </LabelContainer>
  )
}