import path from "node:path";
import { fileURLToPath } from "node:url";
import CopyPlugin from "copy-webpack-plugin";
import ExtReloader from "webpack-ext-reloader";

const fileURL = import.meta.url;
const filepath = fileURLToPath(fileURL);
const dirname = path.dirname(filepath);

export default {
  devtool: "source-map",
  entry: {
    Content: "./src/Content.tsx",
    background: "./src/background.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "static", to: "static" },
      ],
    }),
    new ExtReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        background: "background",
        contentScript: "Content",
      },
    }),
  ],
};
