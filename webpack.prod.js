const common = require("./webpack.common.js");
const merge = require("webpack-merge");

const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

const { devServer, ...conf } = common("production");

module.exports = merge(conf, {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  devtool: false,

  plugins: [
    new HtmlWebpackInlineSourcePlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    }),
  ],
});
