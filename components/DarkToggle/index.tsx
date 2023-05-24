// const toggleDarkMode = (state) => document.documentElement.classList.toggle("dark-mode", state);
// const useDark = window.matchMedia("(prefers-color-scheme: dark)");
// useDark.addListener((evt) => toggleDarkMode(evt.matches));
// button.addEventListener("click", () => {
//     document.documentElement.classList.toggle("dark-mode");
//   });
import { useEffect, useState } from "react";
const THEME_Attribute = "data-color-mode";
import { SunIcon, MoonIcon } from "./icons";

enum THEME_SCHEMA {
  dark = "dark",
  light = "light",
}

const toggleDarkMode = (state: THEME_SCHEMA) => {
  return document.documentElement.setAttribute(THEME_Attribute, state);
};
const matchesToState = (matches?: boolean) =>
  matches ? THEME_SCHEMA.dark : THEME_SCHEMA.light;

const DarkToggle = () => {
  const [state, setState] = useState<THEME_SCHEMA>();
  console.log("state", state);

  useEffect(() => {
    const useDark = window.matchMedia("(prefers-color-scheme: dark)");

    const attribute = document.documentElement.getAttribute(THEME_Attribute);
    const curState =
      (attribute as THEME_SCHEMA) ?? matchesToState(useDark.matches);

    console.log("userDrk", attribute);
    setState(curState);

    const listener = (e: MediaQueryListEvent) => {
      const changeState = matchesToState(e.matches);

      console.log("change", changeState);
      setState(changeState);
      toggleDarkMode(changeState);
    };

    useDark.addEventListener("change", listener);

    return () => {
      useDark.removeEventListener("change", listener);
    };
  }, []);

  console.log(state === THEME_SCHEMA.dark);
  return (
    <>
      {state === THEME_SCHEMA.dark ? (
        <SunIcon
          className="cursor-pointer"
          onClick={() => {
            const newTheme = THEME_SCHEMA.light;
            setState(newTheme);
            toggleDarkMode(newTheme);
          }}
        />
      ) : (
        <MoonIcon
          className="cursor-pointer"
          onClick={() => {
            console.log("click");
            const newTheme = THEME_SCHEMA.dark;
            setState(newTheme);
            toggleDarkMode(newTheme);
          }}
        />
      )}
    </>
  );
};

export default DarkToggle;
