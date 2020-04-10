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
        pragma: "h", // default pragma is React.createElement (only in classic runtime)
        pragmaFrag: "Fragment", // default is React.Fragment (only in classic runtime)
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
