const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const jsesc = require("jsesc");

const CWD = process.cwd();
const DIR_DEST = path.join(CWD, "build");
const DIR_SRC = path.join(CWD, "src");

const loadConfig = () => {
  const { htmlHead, ...linkdashConfig } = require(path.resolve(
    __dirname,
    "../site/demo/demo.config.js"
  ))();

  const escaped = jsesc(linkdashConfig, {
    isScriptContext: true,
    json: true,
  });

  return {
    htmlHead,
    linkdashConfig: escaped,
  };
};

const config = ({ env }) => {
  return {
    entry: [path.resolve(DIR_SRC, "index")],
    devServer: {
      historyApiFallback: true,
      contentBase: DIR_DEST,
      port: 3000,
    },
    devtool: "inline-source-map",
    output: {
      path: DIR_DEST,
      chunkLoading: false,
      wasmLoading: false,
    },
    mode: env || "development",
    resolve: {
      alias: {
        react: "preact/compat",
        "react-dom": "preact/compat",
      },
      extensions: [".js", ".jsx", ".tsx", ".ts"],
    },
    performance: {
      hints: false,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(DIR_SRC, "index.html"),
        ...(process.env.LOAD_DEMO_CONFIG && loadConfig()),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(DIR_SRC, "assets"),
            to: DIR_DEST,
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: "style-loader",
              options: { injectType: "singletonStyleTag" },
            },
            "css-loader",
            "sass-loader",
          ].filter(Boolean),
        },
        {
          test: /\.(png|svg|jpg|gif|pdf)$/,
          use: ["file-loader"],
        },
      ],
    },
  };
};

module.exports = config;
