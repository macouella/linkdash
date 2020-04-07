module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        shippedProposals: true,
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
