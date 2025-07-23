import "styled-components"
import { lightTheme } from "../styles/themes";

type ThemeType = typeof lightTheme;

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {
    // Core colors
    background: string
    text: string
    textSecondary: string
    textTertiary: string
    
    // Card and surface colors
    cardBackground: string
    cardBackgroundSecondary: string
    cardBackgroundTertiary: string
    
    // Border colors
    borderColor: string
    borderColorSecondary: string
    borderColorTertiary: string
    
    // Primary brand colors
    primary: string
    primaryHover: string
    primaryActive: string
    primaryLight: string
    
    // Interactive elements
    connectBg: string
    connectText: string
    connectHover: string
    
    // Hover states
    hover: string
    hoverSecondary: string
    
    // Semantic colors
    warning: string
    warningLight: string
    success: string
    successLight: string
    info: string
    infoLight: string
    
    // Status colors
    error: string
    errorLight: string
    
    // Forum specific colors
    forum: {
      topicCard: {
        background: string
        backgroundHover: string
        text: string
        meta: string
        border: string
      }
    }
    
    // Button states
    button: {
      primary: {
        background: string
        text: string
        hover: string
        active: string
        disabled: string
        disabledText: string
      }
      secondary: {
        background: string
        text: string
        hover: string
        active: string
        disabled: string
        disabledText: string
        border: string
      }
      danger: {
        background: string
        text: string
        hover: string
        active: string
        disabled: string
        disabledText: string
      }
    }
    
    // Input states
    input: {
      background: string
      border: string
      borderFocus: string
      text: string
      placeholder: string
      disabled: string
      disabledText: string
    }
    
    // Shadow and elevation
    shadow: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    
    secondary: string
  }
}