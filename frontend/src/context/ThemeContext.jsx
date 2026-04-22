import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.body.style.background = isDark ? "#0f0f0f" : "#f5f5f5";
    document.body.style.color = isDark ? "#fff" : "#111";
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  const theme = {
    isDark,
    toggle,
    bg: isDark ? "#0f0f0f" : "#f5f5f5",
    surface: isDark ? "#141414" : "#ffffff",
    border: isDark ? "#222" : "#e5e5e5",
    text: isDark ? "#fff" : "#111",
    textMuted: isDark ? "#555" : "#777",
    textSecondary: isDark ? "#ccc" : "#444",
    input: isDark ? "#1a1a1a" : "#f9f9f9",
    inputBorder: isDark ? "#2a2a2a" : "#ddd",
    sidebarBg: isDark ? "#141414" : "#ffffff",
    sidebarBorder: isDark ? "#222" : "#e5e5e5",
    cardBg: isDark ? "#141414" : "#ffffff",
    hoverBg: isDark ? "#1e1e1e" : "#f5f5f5",
    activeNavBg: isDark ? "#1a1a2e" : "#f0edff",
    accent: "#a78bfa",
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{
        background: theme.bg,
        minHeight: "100vh",
        transition: "background 0.2s"
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};