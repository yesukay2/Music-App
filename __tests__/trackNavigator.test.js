import { getNextIndex, getPreviousIndex } from "../utils/trackNavigator.js";
// const { getNextIndex, getPreviousIndex } = require("../utils/trackNavigator");

describe("track navigation", () => {
  const tracks = [1, 2, 3];

  test("next index", () => {
    expect(getNextIndex(0, tracks)).toBe(1);
    expect(getNextIndex(2, tracks)).toBe(0); // loop to start
  });

  test("previous index", () => {
    expect(getPreviousIndex(0, tracks)).toBe(2); // loop to end
    expect(getPreviousIndex(1, tracks)).toBe(0);
  });
});
