import { describe, it } from "mocha";
import { matchSnapshot } from "../register-snapshot-plugin";

describe("ex04", () => {
  it("sub-dir", () => {
    matchSnapshot(18181);
  });
});
