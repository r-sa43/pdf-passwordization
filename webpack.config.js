const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    customize: "./src/js/pdfPW.js",
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "js"),
  },

  resolve: {
    extensions: [".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      { test: /\.css$/, use: "css-loader" },
      { test: /\.html$/, use: "raw-loader" },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
    ],
  },

  resolve: {
    fallback: {
      fs: false,
      crypto: false,
      buffer: false,
      os: false,
      stream: false,
      url: false,
      http: false,
      https: false,
      zlib: false,
      npm: false,
    },
  },

  target: "web",
};
