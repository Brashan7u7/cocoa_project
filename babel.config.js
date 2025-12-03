module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Reanimated debe ser siempre el ÚLTIMO plugin de la lista
      "react-native-reanimated/plugin",
    ],
  };
};