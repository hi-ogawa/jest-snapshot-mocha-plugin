import { describe, it } from "mocha";
import { matchSnapshot } from "./register-snapshot-plugin";

describe("ex01", () => {
  it("bool", () => {
    matchSnapshot(true);
    matchSnapshot(false);
  });
});
