import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export function AppProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const value = {
    isDarkMode,
    setIsDarkMode,
    isExporting,
    setIsExporting,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
