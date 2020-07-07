import { createMuiTheme } from "@material-ui/core/styles";
import { zhCN } from "@material-ui/core/locale";

const theme = createMuiTheme(
  {
    palette: {
      primary: { main: "#660874" },
      secondary: { main: "#fff" },
    },
    typography: {
      fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif,
        Apple Color Emoji, Segoe UI Emoji`,
    },
  },
  zhCN
);

export default theme;
