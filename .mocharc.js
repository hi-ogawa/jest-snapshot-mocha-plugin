module.exports = {
  spec: "build/tsc/test/**/*.js",
  require: [
    "source-map-support/register",
    "./build/tsc/test/register-snapshot-plugin",
  ],
  exit: true,
};
