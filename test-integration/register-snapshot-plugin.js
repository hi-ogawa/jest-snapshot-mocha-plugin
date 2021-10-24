const process = require("process");
const { JestSnapshotMochaPlugin } = require("../build/tsc/src");

const plugin = new JestSnapshotMochaPlugin({
  updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
});

global.matchSnapshot = plugin.matchSnapshot;
exports.mochaHooks = plugin.mochaHooks;
