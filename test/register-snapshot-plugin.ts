//
// 'register' script for custom configuration
//
import { JestSnapshotMochaPlugin } from "../src";
import * as path from "path";
import * as process from "process";

// Define custom snapshot path resolution
function resolveSnapshotPath(testPath: string, snapshotExt: string): string {
  const testDirname = path.dirname(
    path.relative(".", testPath).replace(/^build\/tsc\/test/, "test")
  );
  const testFileNoExt = path
    .basename(testPath)
    .split(".")
    .slice(0, -1)
    .join(".");
  return path.join(testDirname, "__snapshots__", testFileNoExt + snapshotExt);
}

// Use custom flag to update snapshots
export const updateSnapshot: boolean = !!process.env.UPDATE_SNAPSHOT;

// Instantiate "plugin"
const plugin = new JestSnapshotMochaPlugin({
  updateSnapshot,
  resolveSnapshotPath,
});

// Possibly you could export it globally via
//   global.matchSnapshot = plugin.matchSnapshot;
export const matchSnapshot = plugin.matchSnapshot;

// Interface for --require https://mochajs.org/#defining-a-root-hook-plugin
export const mochaHooks = plugin.mochaHooks;
