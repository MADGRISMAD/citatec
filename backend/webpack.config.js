const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { DefinePlugin } = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
module.exports = {
    entry: {
        telemetry: "./src/telemetry/index.ts",
        main: "./src/index.ts",
    },
    target: "node",
    externals: [
        nodeExternals({
            modulesDir: path.resolve(__dirname, "node_modules"),
            allowlist: ["shared-types"], // Incluye shared-types en el bundle
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.json",
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        modules: ["node_modules", path.resolve(__dirname, "../shared/dist"), path.resolve(__dirname, "src")],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new DefinePlugin({
            "process.env": JSON.stringify({
                PORT: process.env.PORT,
                METRICS_ENDPOINT: process.env.METRICS_ENDPOINT,
                METRICS_INTERVAL: process.env.METRICS_INTERVAL,
                LOGS_ENDPOINT: process.env.LOGS_ENDPOINT,
                TRACES_ENDPOINT: process.env.TRACES_ENDPOINT,
                NODE_ENV: process.env.NODE_ENV,
                DATA_PATH: process.env.DATA_PATH,
            }),
        })
    ],
};
