import * as assert from "assert/strict";
import { describe, it } from "mocha";
import { matchSnapshot, updateSnapshot } from "./register-snapshot-plugin";
import { SnapshotError } from "../src";
import * as fs from "fs";

const ACTUAL = {
  x: 1,
  y: 2,
  z: {
    u: 3,
    w: 4,
  },
};

const SNAPSHOT = `\
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[\`ex03 error diff-view 1\`] = \`
Object {
  "x": 1,
  "y": 2,
  "z": Object {
    "u": 3,
    "v": 4,
  },
}
\`;
`;

if (!fs.existsSync("test/__snapshots__")) {
  fs.mkdirSync("test/__snapshots__", { recursive: true });
}
fs.writeFileSync("test/__snapshots__/ex03.snap", Buffer.from(SNAPSHOT));

describe("ex03", () => {
  describe("error", () => {
    (updateSnapshot ? it.skip : it)("diff-view", () => {
      assert.throws(
        () => matchSnapshot(ACTUAL),
        (error: unknown) => {
          assert.ok(error instanceof SnapshotError);
          assert.ok(
            error
              .toString()
              .startsWith(
                "AssertionError [ERR_ASSERTION]: Snapshot not match (test/__snapshots__/ex03.snap)"
              )
          );
          return true;
        }
      );
    });
  });
});
