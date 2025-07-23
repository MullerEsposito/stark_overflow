export const lightTheme = {
  name: "light",
  // Backgrounds
  background: "#f7f8fa", // Soft, not pure white
  cardBackground: "#ffffff",
  cardBackgroundSecondary: "#f3f6fa",
  cardBackgroundTertiary: "#f7f8fa",

  // Borders & Shadows
  borderColor: "#e3e8ee",
  borderColorSecondary: "#e9eaf0",
  borderColorTertiary: "#f3f6fa",
  shadow: {
    sm: "0 1px 2px 0 rgba(60,72,88,0.07)",
    md: "0 2px 8px 0 rgba(60,72,88,0.07)",
    lg: "0 8px 24px 0 rgba(60,72,88,0.10)",
    xl: "0 16px 32px 0 rgba(60,72,88,0.12)",
  },

  // Primary & Accent Colors
  primary: "#7c3aed",
  primaryHover: "#6842c2",
  primaryActive: "#4c2885",
  primaryLight: "#ede9fe",
  accentBlue: "#2563eb",
  accentGreen: "#10b981",
  accentOrange: "#f59e42",

  // Text
  text: "#23272f",
  textSecondary: "#5b6475",
  textTertiary: "#a0aec0",
  textOnPrimary: "#ffffff",

  // Interactive elements
  connectBg: "#7c3aed",
  connectText: "#ffffff",
  connectHover: "#6842c2",

  // Hover states
  hover: "#f3f6fa",
  hoverSecondary: "#ede9fe",

  // Semantic colors
  success: "#10b981",
  successLight: "#e6f9f2",
  warning: "#f59e42",
  warningLight: "#fff7ed",
  error: "#ef4444",
  errorLight: "#fef2f2",
  info: "#2563eb",
  infoLight: "#eff6ff",

  // Forum specific colors
  forum: {
    topicCard: {
      background: "#ffffff",
      backgroundHover: "#f3f6fa",
      text: "#23272f",
      meta: "#5b6475",
      border: "#e3e8ee",
    },
  },

  // Button states
  button: {
    primary: {
      background: "linear-gradient(90deg, #7c3aed 0%, #6842c2 100%)",
      text: "#ffffff",
      hover: "#6842c2",
      active: "#4c2885",
      disabled: "#e3e8ee",
      disabledText: "#a0aec0",
    },
    secondary: {
      background: "#ffffff",
      text: "#23272f",
      hover: "#f3f6fa",
      active: "#e3e8ee",
      disabled: "#f3f6fa",
      disabledText: "#a0aec0",
      border: "#e3e8ee",
    },
    danger: {
      background: "#ef4444",
      text: "#ffffff",
      hover: "#dc2626",
      active: "#991b1b",
      disabled: "#fef2f2",
      disabledText: "#a0aec0",
    },
  },

  // Input states
  input: {
    background: "#ffffff",
    border: "#e3e8ee",
    borderFocus: "#7c3aed",
    text: "#23272f",
    placeholder: "#a0aec0",
    disabled: "#f3f6fa",
    disabledText: "#a0aec0",
  },

  secondary: "#f3f6fa", // matches cardBackgroundSecondary
}
