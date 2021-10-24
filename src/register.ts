//
// Default 'register' script
//
import { JestSnapshotMochaPlugin } from "./index";
import * as process from "process";

export const updateSnapshot: boolean = !!process.env.UPDATE_SNAPSHOT;
export const plugin = new JestSnapshotMochaPlugin({ updateSnapshot });
export const matchSnapshot = plugin.matchSnapshot;

// Interface for --require https://mochajs.org/#defining-a-root-hook-plugin
export const mochaHooks = plugin.mochaHooks;
