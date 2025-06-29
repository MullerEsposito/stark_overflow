import styled, { css } from "styled-components"

export const LabelContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${(props) => props.theme.text};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    gap: 4px;
  }

  @media (max-width: 320px) {
    font-size: 0.75rem;
    gap: 3px;
  }
`

export const Tooltip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
  color: ${(props) => props.theme.textSecondary};
  flex-shrink: 0;

  &:hover > div {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    svg {
      width: 14px;
      height: 14px;
    }
  }

  @media (max-width: 480px) {
    svg {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 320px) {
    svg {
      width: 10px;
      height: 10px;
    }
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
  word-break: break-word;

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

  @media (max-width: 768px) {
    width: 180px;
    margin-left: -90px;
    font-size: 0.75rem;
    padding: 6px;
  }

  @media (max-width: 480px) {
    width: 160px;
    margin-left: -80px;
    font-size: 0.7rem;
    padding: 5px;
  }

  @media (max-width: 320px) {
    width: 140px;
    margin-left: -70px;
    font-size: 0.65rem;
    padding: 4px;
  }
`

export const ValidationIndicator = styled.span<{ $valid: boolean }>`
  margin-left: auto;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => (props.$valid ? "#10b981" : "transparent")};
  transition: background-color 0.3s;
  flex-shrink: 0;
  
  ${(props) =>
    props.$valid &&
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

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
    
    ${(props) =>
      props.$valid &&
      css`
      &::after {
        font-size: 9px;
      }
    `}
  }

  @media (max-width: 480px) {
    width: 12px;
    height: 12px;
    
    ${(props) =>
      props.$valid &&
      css`
      &::after {
        font-size: 8px;
      }
    `}
  }

  @media (max-width: 320px) {
    width: 10px;
    height: 10px;
    
    ${(props) =>
      props.$valid &&
      css`
      &::after {
        font-size: 7px;
      }
    `}
  }
`