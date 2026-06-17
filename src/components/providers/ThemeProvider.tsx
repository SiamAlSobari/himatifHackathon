"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppTheme } from "@/lib/types/theme";
import { useChatSession } from "@/hooks/chat/useChatSession";

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getThemeFromScore = (score: number): AppTheme => {
  if (score >= 0 && score <= 4) return "calm_blue";
  if (score >= 5 && score <= 9) return "warm_yellow";
  if (score >= 10 && score <= 13) return "alert_orange";
  return "deep_purple";
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("calm_blue");
  const { data: chatSessionData } = useChatSession();

  // Load initial theme from sessionStorage, cookies, or latest screening score
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Try sessionStorage
    const savedTheme = window.sessionStorage.getItem("app-theme") as AppTheme | null;
    if (savedTheme && ["calm_blue", "warm_yellow", "alert_orange", "deep_purple"].includes(savedTheme)) {
      setThemeState(savedTheme);
      return;
    }

    // 2. Try cookies
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("app-theme="))
      ?.split("=")[1] as AppTheme | null;
    if (cookieValue && ["calm_blue", "warm_yellow", "alert_orange", "deep_purple"].includes(cookieValue)) {
      setThemeState(cookieValue);
      return;
    }

    // 3. Try latest screening from query data
    if (chatSessionData?.latestScreening) {
      const computedTheme = getThemeFromScore(chatSessionData.latestScreening.score);
      setThemeState(computedTheme);
      
      // Save it
      window.sessionStorage.setItem("app-theme", computedTheme);
      document.cookie = `app-theme=${computedTheme}; path=/; max-age=31536000`;
    }
  }, [chatSessionData]);

  // Apply class on theme change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    
    // Remove existing themes
    root.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        root.classList.remove(cls);
      }
    });

    // Add new theme
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = (nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("app-theme", nextTheme);
      document.cookie = `app-theme=${nextTheme}; path=/; max-age=31536000`;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
