import "styled-components"
import { defaultTheme } from "../styles/themes";

type ThemeType = typeof defaultTheme;

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {
    hover: string
    warning: string
    secondary: string
  }
}