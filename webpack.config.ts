import * as path from "path";
import * as webpack from "webpack";
import * as nodeExternals from "webpack-node-externals";

module.exports = env => {
  const isProduction = env && env.production;
  const serverConfig: any = {
    mode: isProduction ? "production" : "development",
    devtool: "source-map",
    entry: {
      server: path.resolve(__dirname, "src/index.ts")
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js"
    },
    target: "node",
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      extensions: [".ts"]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader'
        }
      ]
    },
    externals: [
      nodeExternals({
        whitelist: /\.(?!js(\?|$))([^.]+(\?|$))/
      })
    ],
    performance: {
      maxEntrypointSize: 10240
    }
  };

  return serverConfig;
};
