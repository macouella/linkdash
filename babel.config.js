module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    [
      "@babel/preset-typescript",
      {
        jsxPragma: "h",
      },
    ],
    [
      "@babel/preset-react",
      {
        pragma: "h",
        pragmaFrag: "Fragment",
      },
    ],
  ],
  plugins: [],
};
