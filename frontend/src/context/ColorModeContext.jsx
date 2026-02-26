import { createContext, useContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem("colorMode") || "light",
  );

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1565c0", light: "#1e88e5", dark: "#0d47a1" },
          secondary: { main: "#00897b", light: "#26a69a", dark: "#00695c" },
          ...(mode === "light"
            ? {
                background: { default: "#f0f4f8", paper: "#ffffff" },
                divider: "rgba(0,0,0,0.08)",
              }
            : {
                background: { default: "#0f1117", paper: "#1a1d27" },
                divider: "rgba(255,255,255,0.08)",
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
          h2: { fontWeight: 800, letterSpacing: "-0.5px" },
          h3: { fontWeight: 800, letterSpacing: "-0.5px" },
          h4: { fontWeight: 700, letterSpacing: "-0.25px" },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          subtitle1: { fontWeight: 600 },
          button: { textTransform: "none", fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        shadows: [
          "none",
          "0px 1px 3px rgba(0,0,0,0.06), 0px 1px 2px rgba(0,0,0,0.04)",
          "0px 2px 6px rgba(0,0,0,0.07), 0px 1px 3px rgba(0,0,0,0.05)",
          "0px 4px 12px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.05)",
          "0px 6px 16px rgba(0,0,0,0.09), 0px 3px 6px rgba(0,0,0,0.06)",
          "0px 8px 24px rgba(0,0,0,0.10), 0px 4px 8px rgba(0,0,0,0.06)",
          "0px 10px 28px rgba(0,0,0,0.11)",
          "0px 12px 32px rgba(0,0,0,0.12)",
          "0px 14px 36px rgba(0,0,0,0.13)",
          "0px 16px 40px rgba(0,0,0,0.14)",
          "0px 18px 44px rgba(0,0,0,0.14)",
          "0px 20px 48px rgba(0,0,0,0.15)",
          "0px 22px 52px rgba(0,0,0,0.15)",
          "0px 24px 56px rgba(0,0,0,0.16)",
          "0px 26px 60px rgba(0,0,0,0.16)",
          "0px 28px 64px rgba(0,0,0,0.17)",
          "0px 30px 68px rgba(0,0,0,0.17)",
          "0px 32px 72px rgba(0,0,0,0.18)",
          "0px 34px 76px rgba(0,0,0,0.18)",
          "0px 36px 80px rgba(0,0,0,0.19)",
          "0px 38px 84px rgba(0,0,0,0.19)",
          "0px 40px 88px rgba(0,0,0,0.20)",
          "0px 42px 92px rgba(0,0,0,0.20)",
          "0px 44px 96px rgba(0,0,0,0.21)",
          "0px 46px 100px rgba(0,0,0,0.21)",
        ],
        components: {
          MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
              root: { borderRadius: 8, paddingLeft: 20, paddingRight: 20 },
              sizeSmall: { borderRadius: 6 },
              sizeLarge: {
                borderRadius: 10,
                paddingTop: 12,
                paddingBottom: 12,
                fontSize: "1rem",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: { backgroundImage: "none" },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: { fontWeight: 600, borderRadius: 6 },
            },
          },
          MuiTextField: {
            defaultProps: { variant: "outlined" },
            styleOverrides: {
              root: { "& .MuiOutlinedInput-root": { borderRadius: 8 } },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: { backgroundImage: "none" },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
