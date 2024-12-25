const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
defaultConfig.resolver = {
  ...defaultConfig.resolver,
  assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
};

defaultConfig.resolver.extraNodeModules = {
  stream: path.resolve(__dirname, "node_modules/stream-browserify"),
  crypto: path.resolve(__dirname, "node_modules/react-native-crypto"),
  randombytes: path.resolve(__dirname, "node_modules/react-native-randombytes"),
  events: path.resolve(__dirname, "node_modules/events"),
  "readable-stream": path.resolve(__dirname, "node_modules/readable-stream"),
};
module.exports = defaultConfig;
