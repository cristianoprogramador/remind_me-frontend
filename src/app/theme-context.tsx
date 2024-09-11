"use client"

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const defaultState = {
  theme: "light" as Theme,
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultState);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultState.theme);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") as Theme;
    setTheme(
      localTheme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
