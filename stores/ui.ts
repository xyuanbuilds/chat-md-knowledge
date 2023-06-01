import { atom, useAtom } from "jotai";

export enum THEME_SCHEMA {
  dark = "dark",
  light = "light",
}

export const themeStore = atom<THEME_SCHEMA>(THEME_SCHEMA.light);

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeStore);

  const toggleTheme = () => {
    setTheme((theme) =>
      theme === THEME_SCHEMA.light ? THEME_SCHEMA.dark : THEME_SCHEMA.light
    );
  };

  return { isDark: theme === THEME_SCHEMA.dark, theme, toggleTheme };
};
