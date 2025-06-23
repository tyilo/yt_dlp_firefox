export default {
  ignoreFiles: ["web-ext-config.cjs", "Makefile", "helper", "popup",
    "options", "build.mjs", "package.json, package-lock.json"],
  build: {
    overwriteDest: true,
  },
};
