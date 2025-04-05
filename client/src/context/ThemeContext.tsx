import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, PaletteMode } from '@mui/material';
import { themePresets } from '../pages/components/themes/theme';// if it's in a separate file

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
  themeIndex: number;
  setThemeIndex: (index: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  themeIndex: 0,
  setThemeIndex: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    return (localStorage.getItem('theme-mode') as PaletteMode) || 'light';
  });

  const [themeIndex, setThemeIndexState] = useState<number>(() => {
    return Number(localStorage.getItem('theme-index')) || 0;
  });

  const setThemeIndex = (index: number) => {
    localStorage.setItem('theme-index', index.toString());
    setThemeIndexState(index);
  };

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme-mode', newMode);
    setMode(newMode);
  };

  const preset = themePresets[themeIndex];
  const colors = preset[mode];

  useEffect(() => {
    document.documentElement.style.backgroundColor = colors.background;
  }, [colors]);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      background: {
        default: colors.background,
        paper: colors.paper,
      },
      text: {
        primary: colors.textPrimary,
        secondary: mode === 'light'
          ? 'rgba(0, 0, 0, 0.6)'
          : 'rgba(255, 255, 255, 0.6)',
        disabled: mode === 'light'
          ? 'rgba(0, 0, 0, 0.38)'
          : 'rgba(255, 255, 255, 0.38)',
      },
      divider: mode === 'light'
        ? 'rgba(0, 0, 0, 0.12)'
        : 'rgba(255, 255, 255, 0.12)',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'all 0.3s linear',
            color: colors.textPrimary,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.paper,
            transition: 'all 0.3s linear',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.paper,
            transition: 'all 0.3s linear',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background,
            transition: 'all 0.3s linear',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: colors.textPrimary,
            transition: 'all 0.3s linear',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: colors.textPrimary,
            transition: 'all 0.3s linear',
          },
        },
      },
    },
    typography: {
      allVariants: {
        color: colors.textPrimary,
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, themeIndex, setThemeIndex }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
