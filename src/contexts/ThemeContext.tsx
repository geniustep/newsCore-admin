import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeSettings {
  // Logos
  logoAr: string;
  logoEn: string;
  logoFr: string;
  favicon: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Typography
  fontFamily: string;
  fontSize: string;
  headingFont: string;

  // Layout
  borderRadius: string;
  spacing: string;

  // Dark Mode
  darkModeEnabled: boolean;
  darkPrimaryColor: string;
  darkBackgroundColor: string;
  darkTextColor: string;
}

const defaultTheme: ThemeSettings = {
  logoAr: '',
  logoEn: '',
  logoFr: '',
  favicon: '',
  primaryColor: '#ed7520',
  secondaryColor: '#0ea5e9',
  accentColor: '#f59e0b',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'IBM Plex Sans Arabic',
  fontSize: '16px',
  headingFont: 'IBM Plex Sans Arabic',
  borderRadius: '0.5rem',
  spacing: 'normal',
  darkModeEnabled: false,
  darkPrimaryColor: '#f59e0b',
  darkBackgroundColor: '#111827',
  darkTextColor: '#f9fafb',
};

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentLogo: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const savedTheme = localStorage.getItem('theme-settings');
    return savedTheme ? { ...defaultTheme, ...JSON.parse(savedTheme) } : defaultTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = isDarkMode && theme.darkModeEnabled
      ? {
          primary: theme.darkPrimaryColor,
          secondary: theme.secondaryColor,
          accent: theme.accentColor,
          background: theme.darkBackgroundColor,
          text: theme.darkTextColor,
        }
      : {
          primary: theme.primaryColor,
          secondary: theme.secondaryColor,
          accent: theme.accentColor,
          background: theme.backgroundColor,
          text: theme.textColor,
        };

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--font-size', theme.fontSize);
    root.style.setProperty('--heading-font', theme.headingFont);
    root.style.setProperty('--border-radius', theme.borderRadius);

    // Apply spacing
    const spacingValues = {
      compact: '0.75rem',
      normal: '1rem',
      relaxed: '1.25rem',
      spacious: '1.5rem',
    };
    root.style.setProperty('--spacing', spacingValues[theme.spacing as keyof typeof spacingValues] || '1rem');

    // Apply body styles
    document.body.style.fontFamily = theme.fontFamily;
    document.body.style.fontSize = theme.fontSize;
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;

    // Update favicon
    if (theme.favicon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = theme.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [theme, isDarkMode]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme-settings', JSON.stringify(theme));
  }, [theme]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    setIsDarkMode(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  // Get current logo based on language (default to Arabic)
  const currentLogo = theme.logoAr || theme.logoEn || theme.logoFr;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        resetTheme,
        isDarkMode,
        toggleDarkMode,
        currentLogo,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
