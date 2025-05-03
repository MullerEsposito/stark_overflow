import styled, { css } from "styled-components"

export const LabelContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${(props) => props.theme.text};
`

export const Tooltip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
  color: ${(props) => props.theme.textSecondary};

  &:hover > div {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`

export const TooltipText = styled.div`
  visibility: hidden;
  position: absolute;
  z-index: 1;
  width: 200px;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  background-color: ${(props) => props.theme.cardBackground};
  color: ${(props) => props.theme.text};
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  transform: translateY(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-weight: normal;
  font-size: 0.8rem;
  border: 1px solid ${(props) => props.theme.borderColor};

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${(props) => props.theme.borderColor} transparent transparent transparent;
  }
`

export const ValidationIndicator = styled.span<{ valid: boolean }>`
  margin-left: auto;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => (props.valid ? "#10b981" : "transparent")};
  transition: background-color 0.3s;
  
  ${(props) =>
    props.valid &&
    css`
    &::after {
      content: '✓';
      color: white;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `}
`