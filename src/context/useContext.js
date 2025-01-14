import React, { useState } from "react";

export const Context = React.createContext();

export const ThemeContext = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const toggle = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  return (
    <Context.Provider value={{ theme, toggle }}>{children}</Context.Provider>
  );
};
