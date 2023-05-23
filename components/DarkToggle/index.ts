// const toggleDarkMode = (state) => document.documentElement.classList.toggle("dark-mode", state);
// const useDark = window.matchMedia("(prefers-color-scheme: dark)");
// useDark.addListener((evt) => toggleDarkMode(evt.matches));
// button.addEventListener("click", () => {
//     document.documentElement.classList.toggle("dark-mode");
//   });

const THEME_Attribute = "data-color-mode";

enum THEME_SCHEMA {
  dark = "dark",
  light = "light",
}

const toggle = (state: THEME_SCHEMA) =>
  document.documentElement.setAttribute(THEME_Attribute, state);

export default toggle;
