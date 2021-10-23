import * as assert from "assert/strict";
import { describe, it } from "mocha";
import { matchSnapshot, updateSnapshot } from "./register-snapshot-plugin";
import { SnapshotError } from "../src";
import * as fs from "fs";

fs.rmSync("test/__snapshots__/ex02.snap", { force: true });

describe("ex02", () => {
  describe("error", () => {
    (updateSnapshot ? it.skip : it)("no-snapshot", () => {
      assert.throws(
        () => matchSnapshot("no-such-snapshot"),
        (error: unknown) => {
          assert.ok(error instanceof SnapshotError);
          assert.equal(
            error.toString(),
            "AssertionError [ERR_ASSERTION]: Snapshot not found (test/__snapshots__/ex02.snap)"
          );
          return true;
        }
      );
    });
  });
});
