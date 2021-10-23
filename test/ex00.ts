import { describe, it } from "mocha";
import { matchSnapshot } from "./register-snapshot-plugin";

describe("ex00", () => {
  it("integer", () => {
    matchSnapshot(1);
    matchSnapshot(2);
    matchSnapshot(3);
  });

  it("object", () => {
    matchSnapshot({
      x: 1,
      y: 2,
      z: 3,
    });

    matchSnapshot({
      x: 1,
      y: 2,
      z: {
        u: 3,
        v: 4,
      },
    });
  });
});
