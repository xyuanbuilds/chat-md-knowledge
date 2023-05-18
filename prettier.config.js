module.export = {
  semi: true,
  trailingComma: "all",
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
  pluginSearchDirs: false,
};
