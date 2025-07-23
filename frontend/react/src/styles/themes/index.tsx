import { darkTheme } from "./dark"
import { lightTheme } from "./light"

// Use the light theme as the base for type safety
export type Theme = typeof lightTheme

export { lightTheme, darkTheme }
