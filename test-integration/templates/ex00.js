const { describe, it } = require("mocha");

describe("test-integration-ex00", () => {
  it("case1", () => {
    matchSnapshot({
      x: 1,
      y: 2,
      z: {
        u: 3,
        w: 4,
      },
    });
  });
});
